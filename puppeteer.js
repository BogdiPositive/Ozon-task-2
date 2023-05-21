const puppeteer = require("puppeteer");

async function getTextPosts(url) {
  const browser = await puppeteer.launch({
    headless: false,
  });
  const page = await browser.newPage();
  await page.goto(url);
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

  const textPosts = await page.evaluate(async () => {
    const posts = [];

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

    document.querySelectorAll(".topic-text_content").forEach((post) => {
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

getTextPosts(
  "https://m.ok.ru/dk?st.cmd=friendStatuses&st.friendId=528551306763&_prevCmd=friendMain&tkn=5007"
)
  .then((posts) => {
    console.log(posts);
  })
  .catch((error) => {
    console.error(error);
  });
