import { Component, type ReactNode } from 'react';
import { AlertTriangle } from 'lucide-react';

type ErrorBoundaryProps = {
  children: ReactNode;
};

type ErrorBoundaryState = {
  hasError: boolean;
};

export default class ErrorBoundary extends Component<ErrorBoundaryProps, ErrorBoundaryState> {
  state: ErrorBoundaryState = {
    hasError: false,
  };

  static getDerivedStateFromError() {
    return { hasError: true };
  }

  componentDidCatch(error: Error, errorInfo: unknown) {
    console.error('BladderTracker error boundary caught an error', error, errorInfo);
  }

  private handleReload = () => {
    window.location.reload();
  };

  render() {
    if (this.state.hasError) {
      return (
        <section
          role="alert"
          className="mx-auto max-w-2xl rounded-[1.75rem] border border-amber-200 bg-amber-50 p-6 text-center shadow-sm"
        >
          <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-white text-amber-600 shadow-sm">
            <AlertTriangle size={22} />
          </div>
          <h2 className="mt-4 text-xl font-bold text-slate-900">Something went wrong</h2>
          <p className="mt-2 text-sm text-slate-600">
            We couldn&apos;t finish loading this screen. Try refreshing to get back to your tracker.
          </p>
          <button
            type="button"
            onClick={this.handleReload}
            className="mt-5 rounded-full bg-lavender-600 px-4 py-3 text-sm font-semibold text-white shadow-sm transition hover:bg-lavender-700"
          >
            Refresh tracker
          </button>
        </section>
      );
    }

    return this.props.children;
  }
}
