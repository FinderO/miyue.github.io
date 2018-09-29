import timeago from "timeago.js";
import config from "./config";

const t = timeago();
const { covers } = config;

// 是否为移动端
export const isMobile =
  /mobile/i.test(window.navigator.userAgent) ||
  document.body.clientWidth < 1200;

// 延时
export const delay = time => new Promise(resolve => setTimeout(resolve, time));

// 文章格式化
export const formatPost = post => {
  const { created_at, body, labels } = post;
  const desc = body.split("<!-- more -->")[0];
  post.desc = desc;
  post.content = body;
  post.cover = covers[(post.number - 1) % covers.length];
  post.date = t.format(created_at, "zh_CN");
  post.filterLabels = labels.sort((a, b) => a.name.length >= b.name.length);
  return post;
};

// 预加载图片
export async function loadImgs({ images, width, height }) {
  return new Promise(resolve => {
    const seq = images.map(cover => {
      return new Promise(resolve => {
        const src = `${cover}?imageView2/2/w/${width}/h/${height}`;
        let imgObj = new Image();
        imgObj.onload = () => {
          resolve();
        };
        imgObj.onerror = () => {
          resolve();
        };
        imgObj.src = src;
      });
    });
    Promise.all(seq)
      .then(() => {
        resolve();
      })
      .catch(console.error);
  }).catch(console.error);
}
