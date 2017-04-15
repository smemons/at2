import { At2Page } from './app.po';

describe('at2 App', () => {
  let page: At2Page;

  beforeEach(() => {
    page = new At2Page();
  });

  it('should display message saying app works', () => {
    page.navigateTo();
    expect(page.getParagraphText()).toEqual('app works!');
  });
});
