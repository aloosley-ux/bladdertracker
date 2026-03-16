import { screen, fireEvent, within } from '@testing-library/react';
import SettingsPage from '../pages/SettingsPage';
import { renderWithProviders } from './renderWithProviders';

const CHILD = {
  id: 'c-1',
  name: 'Baby One',
  dateOfBirth: '',
  dueDate: '2026-06-01',
  caregivers: [],
  parentIds: ['user-1'],
  createdBy: 'user-1',
  lastUpdatedAt: '2026-03-10T00:00:00.000Z',
};

test('mark child as born updates label and button', async () => {
  renderWithProviders(<SettingsPage />, { overrides: { bt_children: [CHILD] }, route: '/settings' });

  // wait for the heading
  await screen.findByRole('heading', { name: /account & settings/i });

  // Small DOB edit button should be present and show the due date initially
  const dobEditBtn = await screen.findByTitle(/Set DOB for Baby One/i);
  expect(dobEditBtn).toBeInTheDocument();
  expect(dobEditBtn).toHaveTextContent(/2026-06-01/);

  // Open the DOB editor, change the date, and save
  fireEvent.click(dobEditBtn);
  const input = await screen.findByLabelText(/Child's date of birth/i);
  fireEvent.change(input, { target: { value: '2026-04-01' } });
  // Find the DOB editor container and click the Save button within it
  const hint = await screen.findByText(/Setting Baby One/i);
  const editorContainer = hint.closest('div');
  const save = within(editorContainer as HTMLElement).getByRole('button', { name: /Save DOB|Save/i });
  fireEvent.click(save);

  // The DOB edit button should now show the new date
  expect(await screen.findByTitle(/Set DOB for Baby One/i)).toHaveTextContent(/2026-04-01/);
});
