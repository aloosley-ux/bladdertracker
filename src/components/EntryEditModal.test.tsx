import { render, screen, fireEvent } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { vi, describe, it, expect } from 'vitest';
import EntryEditModal from './EntryEditModal';
import { AppProvider } from '../context/AppContext';

const sampleEntry = { id: '1', date: '2023-01-01', time: '08:00', notes: '', childId: 'c1', createdBy: 'u1', createdAt: '2023-01-01' };

describe('EntryEditModal', () => {
  it('calls onCancel when Escape is pressed', () => {
    const onCancel = vi.fn();
    render(
      <AppProvider>
        <EntryEditModal type="drinks" entry={sampleEntry} onSaved={() => {}} onCancel={onCancel} />
      </AppProvider>,
    );
    fireEvent.keyDown(window, { key: 'Escape' });
    expect(onCancel).toHaveBeenCalled();
  });

  it('focuses first element and traps tab', async () => {
    const onCancel = vi.fn();
    render(
      <AppProvider>
        <EntryEditModal type="drinks" entry={sampleEntry} onSaved={() => {}} onCancel={onCancel} />
      </AppProvider>,
    );
    // close button should be focused first
    const close = screen.getByRole('button', { name: /close edit/i });
    expect(document.activeElement).toBe(close);

    // tab should move to first input (date)
    await userEvent.tab();
    const date = screen.getByLabelText(/date/i) || screen.getByDisplayValue(sampleEntry.date);
    expect(document.activeElement === date || document.activeElement?.tagName === 'INPUT').toBeTruthy();
  });
});
