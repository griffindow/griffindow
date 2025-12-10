import { expect, test } from '@playwright/test';

test.describe('Griffin Dow Portfolio', () => {
	test.beforeEach(async ({ page }) => {
		await page.goto('/');
	});

	test.describe('Page Load and Core Content', () => {
		test('should load page successfully', async ({ page }) => {
			await expect(page).toHaveURL(/.*\//);
		});

		test('should have correct page title', async ({ page }) => {
			await expect(page).toHaveTitle('Griffin Dow - Product Engineer');
		});

		test('should display profile image', async ({ page }) => {
			const profileImage = page.locator('img[alt="Griffin Dow"]');
			await expect(profileImage).toBeVisible();
			await expect(profileImage).toHaveAttribute('src', '/logo.png');
		});

		test('should display name heading', async ({ page }) => {
			const heading = page.getByRole('heading', { name: 'Griffin Dow' });
			await expect(heading).toBeVisible();
		});

		test('should display job title', async ({ page }) => {
			const title = page.getByText('Product Engineer');
			await expect(title).toBeVisible();
		});

		test('should display tagline', async ({ page }) => {
			const tagline = page.getByText(
				'Relentlessly shaped by vision, I build toward what does not yet exist — beginning with myself.'
			);
			await expect(tagline).toBeVisible();
		});
	});

	test.describe('Social Links', () => {
		test('LinkedIn link should have correct attributes', async ({ page }) => {
			const linkedInLink = page.getByRole('link', { name: /LinkedIn/i });
			await expect(linkedInLink).toBeVisible();
			await expect(linkedInLink).toHaveAttribute('href', 'https://linkedin.com/in/griffinodow');
			await expect(linkedInLink).toHaveAttribute('target', '_blank');
			await expect(linkedInLink).toHaveAttribute('rel', 'noopener noreferrer');
		});

		test('LinkedIn icon should be visible', async ({ page }) => {
			const linkedInLink = page.getByRole('link', { name: /LinkedIn/i });
			const svg = linkedInLink.locator('svg');
			await expect(svg).toBeVisible();
		});

		test('GitHub link should have correct attributes', async ({ page }) => {
			const githubLink = page.getByRole('link', { name: /GitHub/i });
			await expect(githubLink).toBeVisible();
			await expect(githubLink).toHaveAttribute('href', 'https://github.com/griffindow');
			await expect(githubLink).toHaveAttribute('target', '_blank');
			await expect(githubLink).toHaveAttribute('rel', 'noopener noreferrer');
		});

		test('GitHub icon should be visible', async ({ page }) => {
			const githubLink = page.getByRole('link', { name: /GitHub/i });
			const svg = githubLink.locator('svg');
			await expect(svg).toBeVisible();
		});

		test('Email link should have correct attributes', async ({ page }) => {
			const emailLink = page.getByRole('link', { name: /Email/i });
			await expect(emailLink).toBeVisible();
			await expect(emailLink).toHaveAttribute('href', 'mailto:griffin@griffindow.com');
		});

		test('Email icon should be visible', async ({ page }) => {
			const emailLink = page.getByRole('link', { name: /Email/i });
			const svg = emailLink.locator('svg');
			await expect(svg).toBeVisible();
		});

		test('all three social links should be visible', async ({ page }) => {
			const linkedInLink = page.getByRole('link', { name: /LinkedIn/i });
			const githubLink = page.getByRole('link', { name: /GitHub/i });
			const emailLink = page.getByRole('link', { name: /Email/i });

			await expect(linkedInLink).toBeVisible();
			await expect(githubLink).toBeVisible();
			await expect(emailLink).toBeVisible();
		});
	});

	test.describe('Footer', () => {
		test('should display footer with copyright', async ({ page }) => {
			const footer = page.locator('footer');
			await expect(footer).toBeVisible();
		});

		test('should display current year in copyright', async ({ page }) => {
			const currentYear = new Date().getFullYear();
			const copyrightText = page.locator('footer p');
			await expect(copyrightText).toContainText(`© ${currentYear} Griffin Dow`);
		});
	});

	test.describe('Responsive Design', () => {
		test('all key elements should be visible on desktop', async ({ page }) => {
			// This test will run on Desktop Chrome project (1920x1080)
			const profileImage = page.locator('img[alt="Griffin Dow"]');
			const heading = page.getByRole('heading', { name: 'Griffin Dow' });
			const linkedInLink = page.getByRole('link', { name: /LinkedIn/i });
			const githubLink = page.getByRole('link', { name: /GitHub/i });
			const emailLink = page.getByRole('link', { name: /Email/i });
			const footer = page.locator('footer');

			await expect(profileImage).toBeVisible();
			await expect(heading).toBeVisible();
			await expect(linkedInLink).toBeVisible();
			await expect(githubLink).toBeVisible();
			await expect(emailLink).toBeVisible();
			await expect(footer).toBeVisible();
		});

		test('profile image should scale appropriately', async ({ page }) => {
			const profileImage = page.locator('img[alt="Griffin Dow"]');
			await expect(profileImage).toBeVisible();

			// Get the bounding box to verify image is rendered with dimensions
			const boundingBox = await profileImage.boundingBox();
			expect(boundingBox).toBeTruthy();
			expect(boundingBox!.width).toBeGreaterThan(0);
			expect(boundingBox!.height).toBeGreaterThan(0);
		});

		test('social links should be in proper layout', async ({ page }) => {
			const socialLinksContainer = page.locator('div.flex.flex-col.md\\:flex-row');
			await expect(socialLinksContainer).toBeVisible();

			const linkedInLink = page.getByRole('link', { name: /LinkedIn/i });
			const githubLink = page.getByRole('link', { name: /GitHub/i });
			const emailLink = page.getByRole('link', { name: /Email/i });

			// Verify all links are within viewport
			await expect(linkedInLink).toBeInViewport();
			await expect(githubLink).toBeInViewport();
			await expect(emailLink).toBeInViewport();
		});

		test('content should be centered and properly spaced', async ({ page }) => {
			const mainContainer = page.locator('div.max-w-2xl');
			await expect(mainContainer).toBeVisible();

			// Verify the main content container is present and visible
			const boundingBox = await mainContainer.boundingBox();
			expect(boundingBox).toBeTruthy();
		});
	});
});
