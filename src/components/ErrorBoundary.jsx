import React from 'react';
import { AlertTriangle, RefreshCw } from 'lucide-react';

export default class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null, errorInfo: null };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }

  componentDidCatch(error, errorInfo) {
    console.error('LifePulse caught an error:', error, errorInfo);
    this.setState({ errorInfo });
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen bg-slate-900 text-white flex items-center justify-center p-6 font-sans">
          <div className="bg-slate-800 border-2 border-rose-500/80 rounded-3xl p-8 max-w-xl w-full shadow-2xl space-y-4">
            <div className="flex items-center space-x-3 text-rose-400">
              <AlertTriangle className="w-8 h-8 shrink-0" />
              <div>
                <h2 className="text-xl font-black">Something went wrong</h2>
                <p className="text-xs text-slate-300">LifePulse Error Boundary Catch</p>
              </div>
            </div>

            <div className="bg-black/50 p-4 rounded-xl border border-slate-700 text-xs font-mono text-rose-300 overflow-auto max-h-48 whitespace-pre-wrap">
              {this.state.error?.toString()}
            </div>

            {this.state.errorInfo?.componentStack && (
              <details className="text-[11px] text-slate-400 bg-slate-950 p-3 rounded-xl border border-slate-800">
                <summary className="cursor-pointer font-bold text-slate-300 mb-1">Component Stack Trace</summary>
                <pre className="overflow-auto max-h-40">{this.state.errorInfo.componentStack}</pre>
              </details>
            )}

            <div className="flex space-x-3 pt-2">
              <button
                type="button"
                onClick={() => {
                  localStorage.clear();
                  window.location.reload();
                }}
                className="flex-1 bg-rose-600 hover:bg-rose-700 text-white font-bold py-2.5 px-4 rounded-xl text-xs flex items-center justify-center space-x-1.5 shadow"
              >
                <RefreshCw className="w-4 h-4" />
                <span>Clear Cache & Reload App</span>
              </button>
            </div>
          </div>
        </div>
      );
    }
    return this.props.children;
  }
}
