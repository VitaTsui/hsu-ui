// 文档站全局副作用：注册 iconify 图标集（真实项目在入口 index.tsx 里做），
// 否则组件中以 iconify 名（如 "ph:user-bold"）引用的图标不显示。
// 注意：必须与组件内 Icon 使用的入口一致（@iconify/react），否则 addCollection
// 注册到的是另一个模块实例的存储，图标仍不显示。
import { addCollection, IconifyJSON } from "@iconify/react";

import antDesign from "@iconify/json/json/ant-design.json";
import carbon from "@iconify/json/json/carbon.json";
import ep from "@iconify/json/json/ep.json";
import iconPark from "@iconify/json/json/icon-park.json";
import letsIcons from "@iconify/json/json/lets-icons.json";
import materialSymbols from "@iconify/json/json/material-symbols.json";
import mingcute from "@iconify/json/json/mingcute.json";
import tabler from "@iconify/json/json/tabler.json";
import basil from "@iconify/json/json/basil.json";
import fa from "@iconify/json/json/fa.json";
import faSolid from "@iconify/json/json/fa-solid.json";
import octicon from "@iconify/json/json/octicon.json";
import ph from "@iconify/json/json/ph.json";
import ix from "@iconify/json/json/ix.json";
import mdi from "@iconify/json/json/mdi.json";
import faRegular from "@iconify/json/json/fa-regular.json";
import weui from "@iconify/json/json/weui.json";
import fluent from "@iconify/json/json/fluent.json";
import iconParkSolid from "@iconify/json/json/icon-park-solid.json";
import iconParkOutline from "@iconify/json/json/icon-park-outline.json";
import tdesign from "@iconify/json/json/tdesign.json";
import solar from "@iconify/json/json/solar.json";
import ri from "@iconify/json/json/ri.json";
import eosIcons from "@iconify/json/json/eos-icons.json";
import heroiconsOutline from "@iconify/json/json/heroicons-outline.json";
import mi from "@iconify/json/json/mi.json";
import ci from "@iconify/json/json/ci.json";

addCollection(ep);
addCollection(antDesign);
addCollection(mingcute);
addCollection(materialSymbols as IconifyJSON);
addCollection(carbon);
addCollection(letsIcons);
addCollection(iconPark);
addCollection(tabler);
addCollection(basil);
addCollection(fa);
addCollection(faSolid);
addCollection(octicon);
addCollection(ph as IconifyJSON);
addCollection(ix);
addCollection(mdi);
addCollection(faRegular);
addCollection(weui);
addCollection(fluent as IconifyJSON);
addCollection(iconParkSolid);
addCollection(iconParkOutline);
addCollection(tdesign);
addCollection(solar as IconifyJSON);
addCollection(ri as IconifyJSON);
addCollection(eosIcons as IconifyJSON);
addCollection(heroiconsOutline as IconifyJSON);
addCollection(mi as IconifyJSON);
addCollection(ci);
