import {Page, expect} from '@playwright/test';

export class BoardPage {
  private page: Page;
  private projectSelector = 'text=Web Application';
  private mobileProjectSelector = 'text=Mobile Application';

  constructor(page: Page) {
    this.page = page;
  }

  // Navigate to the specific project (Web or Mobile)
  async navigateToProject(project: string) {
    if (project === 'Web Application') {
      await this.page.click(this.projectSelector);
    } else if (project === 'Mobile Application') {
      await this.page.click(this.mobileProjectSelector);
    }
  }
  // Verify task is in the specified column
  async verifyTaskInColumn(taskName: string, columnName: string) {
    const columnLocator = this.page
      .locator(`h2:has-text("${columnName}")`)
      .first()
      .locator('..');
    await expect(columnLocator).toBeVisible();
    const taskLocator = columnLocator
      .locator(`div:has-text("${taskName}")`)
      .first();
    await expect(taskLocator).toBeVisible();
  }

  // Verify tags for a specific task
  async verifyTags(task: string, expectedTags: string[]) {
    const taskLocator = this.page.locator(`text=${task}`);

    // Wait for the task element to be attached and visible
    await taskLocator.waitFor({state: 'attached'});

    // Try to locate the tags container relative to the task
    const taskParentLocator = taskLocator.locator('..');
    const tagsLocator = taskParentLocator.locator(
      'div.flex.flex-wrap.gap-2.mb-3'
    );

    // Wait for the tags container to become visible
    await tagsLocator.waitFor({state: 'visible'});

    // Check the number of tags (span elements)
    const tagElements = await tagsLocator.locator('span').count();

    if (tagElements === 0) {
      throw new Error(`No tags found for task "${task}".`);
    }

    // Verify that the expected tags are present
    for (const tag of expectedTags) {
      await expect(tagsLocator).toContainText(tag);
    }
  }
}
