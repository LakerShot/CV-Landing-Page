import { describe, expect, it, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import { SkillBar } from '@/components/ui/SkillBar';

/*
 * The animation layer is stubbed out: ScrollTrigger needs real layout metrics
 * that jsdom does not provide, and what matters here is that the bar renders
 * correct, accessible markup at its final value before any animation runs.
 */
vi.mock('@/animation/gsap', () => ({
  gsap: { set: vi.fn(), timeline: () => ({ fromTo: vi.fn().mockReturnThis(), to: vi.fn() }) },
  useGSAP: vi.fn(),
  prefersReducedMotion: () => true,
}));

describe('SkillBar', () => {
  it('renders the label and the final level', () => {
    render(<SkillBar label="Vue 3" level={92} ariaLabel="Vue 3: 92 out of 100" />);

    expect(screen.getByText('Vue 3')).toBeInTheDocument();
    expect(screen.getByText('92')).toBeInTheDocument();
  });

  it('exposes the level to assistive technology as a meter', () => {
    render(<SkillBar label="Angular" level={67} ariaLabel="Angular: 67 out of 100" />);

    const meter = screen.getByRole('meter', { name: 'Angular: 67 out of 100' });
    expect(meter).toHaveAttribute('aria-valuenow', '67');
    expect(meter).toHaveAttribute('aria-valuemin', '0');
    expect(meter).toHaveAttribute('aria-valuemax', '100');
  });

  it('sizes the fill from the level so the bar is correct before hydration', () => {
    const { container } = render(
      <SkillBar label="Vite / Webpack" level={95} ariaLabel="Vite / Webpack: 95 out of 100" />,
    );

    const fill = container.querySelector('[data-skill-fill]');
    expect(fill).toHaveStyle({ transform: 'scaleX(0.95)' });
  });
});
