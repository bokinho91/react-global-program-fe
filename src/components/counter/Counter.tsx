import React from 'react'

interface CounterProps {
  initialValue: number
}

interface CounterState {
  count: number
}

class Counter extends React.Component<CounterProps, CounterState> {
  constructor(props: CounterProps) {
    super(props)
    this.state = {
      count: props.initialValue
    }
  }

  decrement = () => {
    this.setState({ count: this.state.count - 1 })
  }

  increment = () => {
    this.setState({ count: this.state.count + 1 })
  }

  render() {
    return React.createElement(
      'div',
      { className: 'counter' },
      React.createElement(
        'button',
        { onClick: this.decrement },
        'Decrement'
      ),
      React.createElement(
        'span',
        { style: { margin: '0 20px' } },
        this.state.count
      ),
      React.createElement(
        'button',
        { onClick: this.increment },
        'Increment'
      )
    )
  }
}

export default Counter
