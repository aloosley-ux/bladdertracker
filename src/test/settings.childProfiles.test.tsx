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

  // Small DOB edit button should be present (separate from the card)
  const dobEditBtn = await screen.findByTitle(/Set DOB for Baby One/i);
  expect(dobEditBtn).toBeInTheDocument();

  // Mark born button should be present and clickable
  const markBtn = await screen.findByRole('button', { name: /Mark born|Born/i });
  expect(markBtn).toBeInTheDocument();

  fireEvent.click(markBtn);

  // After marking born, the label inside the child card should change to DOB
  const nameNodes = await screen.findAllByText(/Baby One/i);
  let childCard: HTMLElement | null = null;
  for (const n of nameNodes) {
    const btn = n.closest('button');
    if (btn) { childCard = btn as HTMLElement; break; }
  }
  expect(childCard).toBeTruthy();
  expect(within(childCard as HTMLElement).getByText(/DOB:/i)).toBeInTheDocument();

  // The small edit button should now have a title indicating DOB
  expect(await screen.findByTitle(/Set DOB for Baby One/i)).toBeInTheDocument();
});
