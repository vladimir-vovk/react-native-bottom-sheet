import React, { ReactElement, useEffect } from 'react'
import { View, useWindowDimensions, StyleSheet } from 'react-native'
import Animated, {
  useAnimatedGestureHandler,
  useAnimatedStyle,
  useSharedValue,
  withTiming,
  interpolate,
  Extrapolate,
  runOnJS,
} from 'react-native-reanimated'
import {
  PanGestureHandler,
  PanGestureHandlerGestureEvent,
} from 'react-native-gesture-handler'
import { Knob } from './Knob'

const styles = StyleSheet.create({
  bottomSheet: {
    ...StyleSheet.absoluteFillObject,
    borderRadius: 14,
    backgroundColor: '#F2F2F6',
  },
  container: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
  },
})

type Props = {
  isOpen: boolean
  onClose: () => void
  height?: number
  duration?: number
  closeThreshold?: number
  children: ReactElement | ReactElement[]
}

export const BottomSheet = ({
  isOpen,
  onClose,
  height: bottomSheetHeight,
  duration = 200,
  closeThreshold = 100,
  children,
}: Props) => {
  const { width, height } = useWindowDimensions()
  const _bottomSheetHeight = bottomSheetHeight ?? height * 0.3
  const translateY = useSharedValue(height) // it's hidden by default

  const animatedStyles = useAnimatedStyle(() => {
    const top = height - _bottomSheetHeight // top of the bottom sheet
    const bottom = height // bottom of the bottom sheet

    // bottom sheet can't be moved higher than top
    // at top point we create a resistance effect
    const _translateY = interpolate(
      translateY.value,
      [top - height / 5, top, bottom],
      [top - 20, top, bottom],
      {
        extrapolateLeft: Extrapolate.CLAMP,
      }
    )

    return {
      width,
      transform: [{ translateY: _translateY }],
    }
  })

  useEffect(() => {
    if (isOpen) {
      const position = height - _bottomSheetHeight
      translateY.value = withTiming(position, {
        duration,
      })
    } else {
      translateY.value = withTiming(height, { duration })
    }
  }, [isOpen])

  type Context = {
    translateY: number
  }

  const gestureHandler = useAnimatedGestureHandler<
    PanGestureHandlerGestureEvent,
    Context
  >({
    onStart: (_, context) => {
      context.translateY = translateY.value
    },
    onActive: (event, context) => {
      translateY.value = context.translateY + event.translationY
    },
    onEnd: (event) => {
      const top = height - _bottomSheetHeight
      const closePoint = top + closeThreshold

      /* clamp to the top */
      if (translateY.value < top) {
        translateY.value = withTiming(top, { duration: 200 })
      } else if (translateY.value > top && translateY.value < closePoint) {
        translateY.value = withTiming(top, { duration: 200 })
        /* clamp to bottom */
      } else {
        // calculate the duration depends on the velocity
        const _duration = ((height - translateY.value) / event.velocityY) * 1000
        // if the velocity higher than default duration then use calculated duration
        translateY.value = withTiming(
          height,
          {
            duration: _duration < duration ? _duration : duration,
          },
          () => {
            if (onClose) {
              runOnJS(onClose)()
            }
          }
        )
      }
    },
  })

  return (
    <PanGestureHandler onGestureEvent={gestureHandler}>
      <Animated.View style={[styles.bottomSheet, animatedStyles]}>
        <Knob />
        <View style={[styles.container, { height: _bottomSheetHeight }]}>
          {children}
        </View>
      </Animated.View>
    </PanGestureHandler>
  )
}
