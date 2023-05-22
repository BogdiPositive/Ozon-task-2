const puppeteer = require("puppeteer");

async function getTextPosts(url) {
  const browser = await puppeteer.launch({
    headless: false,
    timeout: 1000000,
  });
  const page = await browser.newPage();
  await page.goto("https://ok.ru/");
  await page.setViewport({
    width: 1200,
    height: 1800,
  });
  await page.type("#field_email", "+79013619094");
  await page.type("#field_password", "qwerty12345");
  await page.click("input.button-pro");
  await page.waitForNavigation();
  await page.goto(url);

  const textPosts = await page.evaluate(async () => {
    const posts = [];
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

    document.querySelectorAll(".media-text_cnt_tx").forEach((post) => {
      const text = post.textContent.trim();
      if (text) {
        posts.push(text);
      }
    });

    return posts;
  });
  await browser.close();
  return textPosts;
}

getTextPosts("https://ok.ru/profile/675038889/statuses")
  .then((posts) => {
    console.log(posts.length);
    console.log(posts);
  })
  .catch((error) => {
    console.error(error);
  });
