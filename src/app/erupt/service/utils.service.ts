/**
 * Created by liyuepeng on 10/16/19.
 */
import { Injectable } from "@angular/core";
import { deepCopy, LazyService } from "@delon/util";

@Injectable()
export class UtilsService {

  constructor(private lazy: LazyService) {
  }

  analyseHtml(content: string): string {
    let parser = new DOMParser();
    let xmlDoc = parser.parseFromString(`<html><body>${content}</body></html>`, "text/html");
    let body = xmlDoc.getElementsByTagName("body")[0];
    let html = "";
    // link
    let links = body.getElementsByTagName("link");
    for (let i = 0; i < links.length; i++) {
      let link = links[i];
      if (link.getAttribute("rel") === "stylesheet") {
        this.loadStyle(link.getAttribute("href")).then();
      }
    }
    //style
    let styles = body.getElementsByTagName("style");
    for (let i = 0; i < styles.length; i++) {
      let style = styles[i];
      html += style.outerHTML;
    }
    //script脚本再页面渲染完成后执行
    setTimeout(() => {
      // script
      let scripts = xmlDoc.getElementsByTagName("script");
      for (let i = 0; i < scripts.length; i++) {
        let script = scripts[i];
        let src = script.getAttribute("src");
        if (src) {
          this.loadScript(src).then();
        } else {
          setTimeout(function() {
            eval(script.innerHTML);
          }, 200);
        }
      }
    }, 200);
    html += body.getElementsByTagName("template")[0].innerHTML;
    return html;
  }

  async loadScript(src) {
    await this.lazy.loadScript(src).then(res => res);
  }

  async loadStyle(src) {
    await this.lazy.loadStyle(src).then(res => res);
  }

}