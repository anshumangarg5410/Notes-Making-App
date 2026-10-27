import React from 'react';
import { AlertTriangle, RefreshCw } from 'lucide-react';

export class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }

  componentDidCatch(error, errorInfo) {
    console.error('[ErrorBoundary caught an error]:', error, errorInfo);
  }

  handleReload = () => {
    this.setState({ hasError: false, error: null });
    window.location.reload();
  };

  render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen bg-warm-bg dark:bg-charcoal-950 flex flex-col items-center justify-center p-6 text-charcoal-900 dark:text-cream-50 select-none">
          <div className="max-w-md w-full bg-warm-card dark:bg-charcoal-900 border border-warm-border dark:border-charcoal-800 rounded-3xl p-8 shadow-card text-center space-y-4">
            <div className="w-14 h-14 mx-auto rounded-2xl bg-amber-100 dark:bg-amber-900/40 text-amber-600 dark:text-amber-400 flex items-center justify-center">
              <AlertTriangle className="w-7 h-7" />
            </div>

            <h2 className="font-serif text-2xl font-bold">
              Something went wrong
            </h2>

            <p className="text-sm text-charcoal-500 dark:text-charcoal-400">
              An unexpected error occurred while rendering the workspace. Your notes in MongoDB remain safe.
            </p>

            {this.state.error && (
              <div className="p-3 bg-cream-100 dark:bg-charcoal-800/80 rounded-xl text-left font-mono text-xs text-charcoal-600 dark:text-cream-200 overflow-x-auto max-h-24">
                {this.state.error.message || String(this.state.error)}
              </div>
            )}

            <button
              onClick={this.handleReload}
              className="inline-flex items-center space-x-2 px-5 py-2.5 bg-terracotta-500 hover:bg-terracotta-600 text-white rounded-xl text-sm font-medium transition-all shadow-sm active:scale-95"
            >
              <RefreshCw className="w-4 h-4" />
              <span>Reload Workspace</span>
            </button>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}
