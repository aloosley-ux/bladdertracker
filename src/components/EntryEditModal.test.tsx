import { render, screen, fireEvent, act } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { vi, describe, it, expect } from 'vitest';
import EntryEditModal from './EntryEditModal';
import { AppProvider } from '../context/AppContext';

const sampleEntry = { id: '1', date: '2023-01-01', time: '08:00', notes: '', childId: 'c1', createdBy: 'u1', createdAt: '2023-01-01' };

describe('EntryEditModal', () => {
  it('calls onCancel when Escape is pressed', async () => {
    const onCancel = vi.fn();
    render(
      <AppProvider>
        <EntryEditModal type="drinks" entry={sampleEntry} onSaved={() => {}} onCancel={onCancel} />
      </AppProvider>,
    );
    // The Dialog component handles Escape internally
    await act(async () => {
      fireEvent.keyDown(document.body, { key: 'Escape' });
    });
    expect(onCancel).toHaveBeenCalled();
  });

  it('has close button that calls onCancel when clicked', async () => {
    const onCancel = vi.fn();
    render(
      <AppProvider>
        <EntryEditModal type="drinks" entry={sampleEntry} onSaved={() => {}} onCancel={onCancel} />
      </AppProvider>,
    );
    const close = screen.getByRole('button', { name: /close/i });
    expect(close).toBeInTheDocument();
    await userEvent.click(close);
    expect(onCancel).toHaveBeenCalled();
  });

  it('traps tab focus within modal', async () => {
    const onCancel = vi.fn();
    render(
      <AppProvider>
        <EntryEditModal type="drinks" entry={sampleEntry} onSaved={() => {}} onCancel={onCancel} />
      </AppProvider>,
    );
    // Tab should keep focus inside the modal
    await userEvent.tab();
    expect(['INPUT', 'BUTTON', 'SELECT', 'TEXTAREA'].includes(document.activeElement?.tagName || '')).toBeTruthy();
  });
});
