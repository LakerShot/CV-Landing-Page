import { describe, expect, it, vi, beforeEach } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { NextIntlClientProvider } from 'next-intl';
import en from '../../messages/en.json';
import { LocaleSwitcher } from '@/components/layout/LocaleSwitcher';

const replace = vi.fn();

vi.mock('@/i18n/navigation', () => ({
  usePathname: () => '/',
  useRouter: () => ({ replace, push: vi.fn() }),
}));

function renderSwitcher(locale = 'en') {
  return render(
    <NextIntlClientProvider locale={locale} messages={en}>
      <LocaleSwitcher />
    </NextIntlClientProvider>,
  );
}

describe('LocaleSwitcher', () => {
  beforeEach(() => {
    replace.mockClear();
  });

  it('renders a button per locale and marks the active one', () => {
    renderSwitcher('en');

    const en_ = screen.getByRole('button', { name: /EN/i });
    const ru = screen.getByRole('button', { name: /RU/i });

    expect(en_).toHaveAttribute('aria-current', 'true');
    expect(ru).not.toHaveAttribute('aria-current');
  });

  it('navigates to the same path under the other locale', async () => {
    const user = userEvent.setup();
    renderSwitcher('en');

    await user.click(screen.getByRole('button', { name: /RU/i }));

    expect(replace).toHaveBeenCalledWith('/', { locale: 'ru' });
  });

  it('does not navigate when the active locale is clicked', async () => {
    const user = userEvent.setup();
    renderSwitcher('ru');

    await user.click(screen.getByRole('button', { name: /RU/i }));

    expect(replace).not.toHaveBeenCalled();
  });
});
