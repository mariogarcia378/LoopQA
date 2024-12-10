// tests/login.spec.ts
import {test, expect} from '@playwright/test';
import {LoginPage} from '../pages/login.page';
import {BoardPage} from '../pages/board.page';
import * as fs from 'fs';

interface TestCase {
  testCase: string;
  url: string;
  email: string;
  password: string;
  page: string;
  task: string;
  column: string;
  tags: string[];
}

const testData = JSON.parse(
  fs.readFileSync('data-driven/testData.json', 'utf-8')
);

test.describe('Data-Driven Technical Evaluation Test @sanity', () => {
  let loginPage: LoginPage;
  let boardPage: BoardPage;

  test.beforeEach(async ({page, browser}) => {
    loginPage = new LoginPage(page);
    boardPage = new BoardPage(page);
    test.info().annotations.push(
      {
        type: 'Browser Name',
        description: browser.browserType().name(),
      },
      {
        type: 'Browser Version',
        description: browser.version(),
      }
    );

    // Navigate to the login page and log in
    await loginPage.navigate('/');
    await loginPage.login('admin', 'password123');
  });

  testData.forEach(
    (data: {task: string; column: string; project: string; tags: string[]}) => {
      test(`Verify task "${data.task}" in the "${data.column}" column for project "${data.project}"`, async ({
        page,
      }) => {
        // Navigate to the appropriate project
        await boardPage.navigateToProject(data.project);

        // Verify task in the column
        await boardPage.verifyTaskInColumn(data.task, data.column);

        // Verify task tags
        await boardPage.verifyTags(data.task, data.tags);
      });
    }
  );
});
