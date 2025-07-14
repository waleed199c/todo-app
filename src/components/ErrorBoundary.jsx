import { Component } from 'react';

export default class ErrorBoundary extends Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }

  componentDidCatch(error, info) {
    console.error("Caught by ErrorBoundary:", error, info);
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="p-6 rounded bg-red-900 text-white">
          <h2 className="text-xl font-bold mb-2">🚨 Something went wrong.</h2>
          <p className="mb-2">The aurora dimmed... but it's not your fault.</p>
          <pre className="text-sm opacity-70">{this.state.error?.message}</pre>
        </div>
      );
    }

    return this.props.children;
  }
}
