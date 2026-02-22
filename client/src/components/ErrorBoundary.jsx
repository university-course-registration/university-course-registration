import { Component } from 'react'

class ErrorBoundary extends Component {
  constructor(props) {
    super(props)
    this.state = { hasError: false, error: null, errorInfo: null }
  }

  static getDerivedStateFromError(error) {
    // Update state so the next render will show the fallback UI
    return { hasError: true }
  }

  componentDidCatch(error, errorInfo) {
    // Log error details for debugging
    console.error('Error caught by boundary:', error, errorInfo)
    
    // Update state with error details
    this.state = {
      hasError: true,
      error,
      errorInfo
    }

    // You can also log the error to an error reporting service here
    // logErrorToService(error, errorInfo)
  }

  handleReset = () => {
    this.setState({ hasError: false, error: null, errorInfo: null })
  }

  render() {
    if (this.state.hasError) {
      // Fallback UI
      return (
        <div className="flex min-h-screen items-center justify-center bg-slate-50 px-4">
          <div className="w-full max-w-md rounded-2xl bg-white p-8 shadow-lg">
            <div className="mb-6 text-center">
              <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-rose-100">
                <svg
                  className="h-8 w-8 text-rose-600"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
                  />
                </svg>
              </div>
              <h2 className="text-2xl font-semibold text-slate-900">
                Something went wrong
              </h2>
              <p className="mt-2 text-sm text-slate-600">
                We encountered an unexpected error. Please try refreshing the page.
              </p>
            </div>

            {import.meta.env.DEV && this.state.error && (
              <div className="mb-6 rounded-lg bg-slate-100 p-4">
                <p className="mb-2 text-xs font-semibold text-slate-700">
                  Error Details (Development Only):
                </p>
                <p className="text-xs text-slate-600">
                  {this.state.error.toString()}
                </p>
                {this.state.errorInfo && (
                  <details className="mt-2">
                    <summary className="cursor-pointer text-xs font-medium text-slate-700">
                      Stack Trace
                    </summary>
                    <pre className="mt-2 overflow-auto text-xs text-slate-600">
                      {this.state.errorInfo.componentStack}
                    </pre>
                  </details>
                )}
              </div>
            )}

            <div className="flex gap-3">
              <button
                onClick={() => window.location.reload()}
                className="flex-1 rounded-full bg-accent-500 px-6 py-3 text-sm font-medium text-white transition-colors hover:bg-accent-600"
              >
                Refresh Page
              </button>
              <button
                onClick={this.handleReset}
                className="flex-1 rounded-full border border-slate-300 bg-white px-6 py-3 text-sm font-medium text-slate-700 transition-colors hover:bg-slate-50"
              >
                Try Again
              </button>
            </div>

            <div className="mt-4 text-center">
              <a
                href="/"
                className="text-sm text-accent-600 hover:text-accent-700"
              >
                Go to Home
              </a>
            </div>
          </div>
        </div>
      )
    }

    return this.props.children
  }
}

export default ErrorBoundary
