import {Page, Locator, expect} from '@playwright/test';
export class LoginPage {
  private page: Page;
  private loginBoxTitle: Locator;
  private userNameTextbox: Locator;
  private passwordTextbox: Locator;
  private signinButton: Locator;

  constructor(page: Page) {
    this.page = page;
    this.loginBoxTitle = page.getByRole('heading', {
      name: 'Project Board Login',
    });
    this.userNameTextbox = page.getByRole('textbox', {name: 'Username'});
    this.passwordTextbox = page.getByRole('textbox', {name: 'Password'});
    this.signinButton = page.getByRole('button', {name: 'Sign in'});
  }
  // Navigate to the Page
  async navigate(url: string) {
    await this.page.goto(url);
  }
  // Method to perform login
  async login(username: string, password: string) {
    await expect(this.loginBoxTitle).toContainText('Project Board Login');
    await this.userNameTextbox.fill(username);
    await this.passwordTextbox.fill(password);
    await this.signinButton.click();
  }
}
