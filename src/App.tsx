import React, { useState } from 'react'
import { StyleSheet, View, Button, Text } from 'react-native'
import { BottomSheet } from './BottomSheet'

export default function App() {
  const [isOpen, setOpen] = useState(false)

  const onOpenBottomSheet = () => {
    setOpen(!isOpen)
  }

  const onClose = () => {
    setOpen(false)
  }

  return (
    <View style={styles.container}>
      <Button
        title="Press to open / close bottom sheet"
        onPress={onOpenBottomSheet}
      />

      <BottomSheet {...{ isOpen, onClose }}>
        <View style={styles.content}>
          <Text>Drag me! 👆🏻</Text>
        </View>
      </BottomSheet>
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
  content: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
})
