const puppeteer = require("puppeteer");

(async () => {
  const browser = await puppeteer.launch({
    headless: false,
  });
  const page = await browser.newPage();
  await page.goto("https://ok.ru/");
  await page.setViewport({
    width: 1800,
    height: 600,
  });
  await page.type("#field_email", "+79013619094");
  await page.type("#field_password", "qwerty12345");
  await page.click("input.button-pro");
  await page.waitForNavigation();
  await page.goto("https://ok.ru/profile/528551306763/statuses");
  await autoScroll(page);
  const postLinks = await page.$$eval(".media-text_a", (links) =>
    links.map((link) => link.href)
  );
  const posts = [];

  for (let i = 0; i < postLinks.length; i++) {
    await page.goto(postLinks[i]);

    const link = postLinks[i];
    const parts = link.split("/");
    const lastPart = parts[parts.length - 1];
    const numericValue = parseInt(lastPart);
    await page.waitForSelector(`div[data-tid="${numericValue}"]`);
    const element = await page.$(`div[data-tid="${numericValue}"]`);
    if (element) {
      const postText = await page.$eval(
        `div[data-tid="${numericValue}"]`,
        (el) => el.innerText
      );
      posts.push(postText);
    } else {
      continue;
    }
  }

  console.log(posts);

  await browser.close();
})();

async function autoScroll(page) {
  await page.evaluate(async () => {
    await new Promise((resolve) => {
      var totalHeight = 0;
      var distance = 100;
      var timer = setInterval(() => {
        var scrollHeight = document.body.scrollHeight;
        window.scrollBy(0, distance);
        totalHeight += distance;
        if (document.querySelector("a.link-show-more")) {
          document.querySelector("a.link-show-more").click();
        }
        if (totalHeight >= scrollHeight - window.innerHeight) {
          clearInterval(timer);
          resolve();
        }
      }, 100);
    });
  });
}

// https://m.ok.ru/dk?st.cmd=friendStatuses&st.friendId=528551306763&_prevCmd=friendMain&tkn=1559
