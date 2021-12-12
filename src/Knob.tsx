import React from 'react'
import { View, StyleSheet } from 'react-native'

const styles = StyleSheet.create({
  knob: {
    width: 38,
    height: 6,
    backgroundColor: 'rgba(0, 0, 0, 0.25)',
    alignSelf: 'center',
    marginVertical: 6,
    borderRadius: 3,
  },
})

export const Knob = () => <View style={styles.knob} />
