const puppeteer = require("puppeteer");

(async () => {
  const browser = await puppeteer.launch({
    headless: false,
  });
  const page = await browser.newPage();
  await page.goto(
    "https://m.ok.ru/dk?st.cmd=friendStatuses&st.friendId=528551306763&_prevCmd=friendMain&tkn=1559"
  );
  await page.setViewport({
    width: 1200,
    height: 800,
  });
  await page.click("input[name=loginButton]");
  await page.waitForNavigation();
  await page.type("#field_login", "+79013619094");
  await page.type("#field_password", "qwerty12345");
  await page.click("input[name=button_login]");
  await page.waitForNavigation();
  await autoScroll(page);
  const postLinks = await page.$$eval(".clnk", (links) =>
    links.map((link) => link.href)
  );

  const postTexts = [];
  for (let i = 0; i < postLinks.length; i++) {
    await page.goto(postLinks[i]);
    const element = await page.$(".topic-text_content");
    if (element) {
      const postText = await page.$eval(".topic-text_content", (el) =>
        el.innerText.trim()
      );
      postTexts.push(postText);
    } else {
      continue;
    }
  }

  console.log(postTexts);

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

        if (totalHeight >= scrollHeight - window.innerHeight) {
          clearInterval(timer);
          resolve();
        }
      }, 100);
    });
  });
}

// https://m.ok.ru/dk?st.cmd=friendStatuses&st.friendId=528551306763&_prevCmd=friendMain&tkn=1559
