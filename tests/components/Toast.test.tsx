import React from 'react';
import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { render, screen, fireEvent, act } from '@testing-library/react';
import { ToastProvider } from '@/contexts/ToastContext';
import { useToast } from '@/hooks/useToast';

// A test component to trigger toasts using the useToast hook
function TestComponent() {
  const { toast } = useToast();

  return (
    <div>
      <button onClick={() => toast.info('Info notification', 5000)}>Show Info</button>
      <button onClick={() => toast.error('Error notification', 3000)}>Show Error</button>
      <button onClick={() => toast('Default notification')}>Show Default</button>
    </div>
  );
}

describe('Toast Notification System', () => {
  beforeEach(() => {
    vi.useFakeTimers();
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  it('renders children correctly', () => {
    render(
      <ToastProvider>
        <div>Child Content</div>
      </ToastProvider>
    );

    expect(screen.getByText('Child Content')).toBeInTheDocument();
  });

  it('triggers and renders info/error/default toasts correctly', () => {
    render(
      <ToastProvider>
        <TestComponent />
      </ToastProvider>
    );

    // Initial state: no toasts should be visible
    expect(screen.queryByText('Info notification')).not.toBeInTheDocument();

    // Trigger info toast
    fireEvent.click(screen.getByText('Show Info'));
    expect(screen.getByText('Info notification')).toBeInTheDocument();
    expect(screen.getByRole('alert')).toHaveClass('border-blue-100');

    // Trigger error toast
    fireEvent.click(screen.getByText('Show Error'));
    expect(screen.getByText('Error notification')).toBeInTheDocument();

    // Stacks multiple simultaneous toasts correctly
    const alerts = screen.getAllByRole('alert');
    expect(alerts).toHaveLength(2);
  });

  it('allows manual dismissal of toasts', async () => {
    render(
      <ToastProvider>
        <TestComponent />
      </ToastProvider>
    );

    fireEvent.click(screen.getByText('Show Info'));
    expect(screen.getByText('Info notification')).toBeInTheDocument();

    const closeButton = screen.getByLabelText('Close notification');
    fireEvent.click(closeButton);

    // It sets isExiting state, then calls onDismiss after 200ms
    act(() => {
      vi.advanceTimersByTime(200);
    });

    expect(screen.queryByText('Info notification')).not.toBeInTheDocument();
  });

  it('auto-dismisses toasts after the specified duration', () => {
    render(
      <ToastProvider>
        <TestComponent />
      </ToastProvider>
    );

    // Show Error toast with 3000ms duration
    fireEvent.click(screen.getByText('Show Error'));
    expect(screen.getByText('Error notification')).toBeInTheDocument();

    // Advance timer to just before duration ends
    act(() => {
      vi.advanceTimersByTime(2800);
    });
    expect(screen.getByText('Error notification')).toBeInTheDocument();

    // Advance to trigger exit animation (starts at 3000ms, runs for 200ms)
    act(() => {
      vi.advanceTimersByTime(200); // at 3000ms, sets exiting
    });
    act(() => {
      vi.advanceTimersByTime(200); // finishes exiting, unmounts
    });

    expect(screen.queryByText('Error notification')).not.toBeInTheDocument();
  });
});
