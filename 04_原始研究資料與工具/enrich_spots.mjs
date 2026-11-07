import fs from 'fs';
import path from 'path';

const SPOT_ENRICHMENTS = {
  // 香港美食
  '金華冰廳': {
    must_order: '馳名鮮油菠蘿包（HK$13）、得獎法蘭西多士（HK$20）、香滑凍奶茶（HK$22）、酥皮蛋撻（HK$10）',
    hours: '每日 06:30–22:00',
    price: '人均約 HK$40–60',
    photo: 'https://images.unsplash.com/photo-1509440159596-0249088772ff?w=600&auto=format&fit=crop&q=80',
    tips: '號稱全港第一菠蘿油！堂食內用每人需點一杯飲品；若不想排隊，走門口外帶窗口現買現走最快！'
  },
  '妹記生滾粥品': {
    must_order: '銅鍋生滾鮮魚腩粥（HK$48）、牛肉及第粥（HK$45）、香脆炸兩腸粉（HK$20）',
    hours: '07:00–14:30（週二公休，賣完提早收）',
    price: '人均約 HK$45–65',
    photo: 'https://images.unsplash.com/photo-1541696432-82c6da8ce7bf?w=600&auto=format&fit=crop&q=80',
    tips: '花園街熟食中心 4 樓老街坊名店，銅鍋大火滾煮鮮甜帶鑊氣，早上去免排隊。'
  },
  '一點心': {
    must_order: '香煎蘿蔔糕（HK$24）、鮮蝦腐皮捲（HK$30）、豉汁蒸排骨（HK$26）、蜜汁叉燒包（HK$22）',
    hours: '週一至五 10:00–23:00、週六日 09:00–23:00',
    price: '人均約 HK$60–90',
    photo: 'https://images.unsplash.com/photo-1541696432-82c6da8ce7bf?w=600&auto=format&fit=crop&q=80',
    tips: '平價米其林必比登推薦，點心全手工現點現蒸，避開 12:30-14:00 用餐尖峰可省去排隊時間。'
  },
  '沾仔記（威靈頓街）': {
    must_order: '乒乓球鮮蝦雲吞麵（HK$40）、至尊三寶麵（鮮蝦雲吞+鮮牛肉+鯪魚球 HK$52）、油菜芥藍（HK$20）',
    hours: '每日 11:00–21:30',
    price: '人均約 HK$40–55',
    photo: 'https://images.unsplash.com/photo-1569718212165-3a8278d5f624?w=600&auto=format&fit=crop&q=80',
    tips: '米其林必比登推薦！雲吞如乒乓球大，內包 3-4 隻脆蝦。翻桌率極快，客滿等 3-5 分鐘即可入座。'
  },
  '富記粥品': {
    must_order: '馳名古法燒鵝（HK$85）、生滾滑牛肉粥（HK$42）、鮮及第魚片粥（HK$45）',
    hours: '每日 06:30–23:30（早午晚宵夜全包）',
    price: '人均約 HK$45–75',
    tips: '半世紀老店，粥底綿密化口，晚間宵夜隨到隨坐，不用人擠人。'
  },
  '敏華冰廳': {
    must_order: '黯然銷魂飯（厚切叉燒煎雙蛋 HK$65）、Big Men 菠蘿包（夾午餐肉煎蛋牛油 HK$34）、金牌絲襪奶茶',
    hours: '每日 07:00–22:00',
    price: '人均約 HK$45–70',
    tips: '翻桌神速、座位多免排隊，叉燒厚實淋甜豉油拌飯，青少年最愛！'
  },
  '佳佳甜品': {
    must_order: '寧波薑汁芝麻糊湯圓（HK$29）、冰糖燉木瓜（HK$32）、濃郁香滑核桃露（HK$28）',
    hours: '每日 12:00–01:00（凌晨打烊）',
    price: '人均約 HK$30–40',
    photo: 'https://images.unsplash.com/photo-1551024709-8f23befc6f87?w=600&auto=format&fit=crop&q=80',
    tips: '米其林推薦老牌甜品，上菜 30 秒翻桌極快，吃飽後的完美宵夜。'
  },
  '泰昌餅家（擺花街）': {
    must_order: '經典牛油皮皇牌蛋撻（單個 HK$10）、沙翁（HK$11）',
    hours: '每日 09:30–19:30',
    price: '人均約 HK$10–25',
    photo: 'https://images.unsplash.com/photo-1509440159596-0249088772ff?w=600&auto=format&fit=crop&q=80',
    tips: '前港督最愛蛋撻名店，外帶窗口隨買隨走免排隊。'
  },
  '山頂纜車': {
    must_order: '第六代復古山頂纜車來回票 + 凌霄閣摩天台 428 百萬夜景套票',
    hours: '山頂纜車 07:30–23:00；摩天台平日 10:00–22:00，週末 08:00–22:00',
    price: '套票成人約 HK$148–168',
    photo: 'https://images.unsplash.com/photo-1506318137071-a8e063b4bec0?w=600&auto=format&fit=crop&q=80',
    tips: '建議下午 16:30 上山看日落，待到 18:00 看璀璨維港百萬夜景，上山坐右手邊景觀最佳。'
  },
  '天星小輪': {
    must_order: '中環 ↔ 尖沙咀上層船票（維多利亞港無敵海景）',
    hours: '每日 06:30–23:30（每 6–10 分鐘一班）',
    price: '成人平日 HK$5.0、週末 HK$6.5',
    photo: 'https://images.unsplash.com/photo-1536599018102-9f803c140fc1?w=600&auto=format&fit=crop&q=80',
    tips: '國家地理評選人生必遊 50 個景點之一，刷八達通直接進閘，便宜震撼。'
  },
  '香港迪士尼樂園': {
    must_order: '魔雪奇緣世界（魔雪奇幻之旅、雪嶺滑雪橇）、灰熊山極速礦車、迷離大宅、夜間「迪士尼星夢光影之旅」城堡煙火',
    hours: '常規 10:30–20:30（提早入園 09:30）',
    price: '一日門票成人 HK$669–939',
    photo: 'https://images.unsplash.com/photo-1513889961551-628c1e5e2ee9?w=600&auto=format&fit=crop&q=80',
    tips: '下載官方 App 即時查看排隊時間；煙火表演建議提早 30-40 分鐘在美國小鎮大街中央卡位。'
  },
  '波鞋街': {
    must_order: 'Nike, Adidas, New Balance 限量聯名球鞋、潮流運動外套與特價球鞋',
    hours: '每日 11:30–22:30（傍晚人潮最旺）',
    price: '一般球鞋約 HK$400–1,500+',
    tips: '花園街一整排運動用品店，買鞋記得貨比三家，新款通常有連鎖專賣保障。'
  },
  '女人街': {
    must_order: '香港特色雙層巴士模型、復古鐵牌、趣味手機殼、刺繡帆布包',
    hours: '每日 12:00–23:00（傍晚開始熱鬧）',
    price: '小紀念品約 HK$20–100',
    tips: '夜市小攤記得殺價，通常從開價 6-7 折談起。'
  },
  '信和中心': {
    must_order: 'B1–3 樓二次元動漫手辦模型、一番賞、Switch/PS5 遊戲卡帶、日本正版扭蛋',
    hours: '每日 12:00–22:00（各小店約 13:00 陸續開門）',
    price: '盲盒扭蛋約 HK$30–60，模型約 HK$150–800+',
    tips: '香港動漫聖地！樓上是老牌店舖，青少年逛模型挖寶首選。'
  },

  // 澳門美食與景點
  '安德魯餅店（官也街）': {
    must_order: '熱騰騰招牌葡式蛋撻（單個 MOP 11，半打盒裝 MOP 65）、英式提子酥、朱古力批',
    hours: '每日 09:00–21:00',
    price: '單個 MOP 11，人均約 MOP 20–40',
    photo: 'https://images.unsplash.com/photo-1509440159596-0249088772ff?w=600&auto=format&fit=crop&q=80',
    tips: '澳門葡撻始祖！剛出爐焦糖外皮層層酥脆，內餡奶香滑順，排隊前進很快。'
  },
  '大利來記（官也街）': {
    must_order: '招牌炭燒帶骨豬扒包（MOP 48）、豬扒菠蘿包（MOP 50）、咖哩魚蛋（MOP 25）',
    hours: '每日 09:00–18:30',
    price: '人均約 MOP 50–75',
    tips: '豬排醃製入味帶炭烤香氣，肉質厚實多汁，配菠蘿包甜鹹融合。'
  },
  '誠昌飯店': {
    must_order: '馳名鮮甜水蟹粥（小煲約 MOP 160，大煲約 MOP 220）、酥炸墨魚丸、椒鹽白飯魚',
    hours: '每日 11:30–23:30',
    price: '人均約 MOP 100–150',
    tips: '官也街水蟹粥霸主！整隻青蟹熬入綿密金黃粥底，蟹膏蟹肉鮮甜無比。'
  },
  '黃枝記粥麵': {
    must_order: '招牌鮮蝦雲吞蝦子撈麵（MOP 80）、手打竹升雲吞麵（MOP 68）、乾炒牛河（MOP 78）',
    hours: '每日 09:30–21:30',
    price: '人均約 MOP 70–95',
    tips: '傳承半世紀古法竹升壓麵，彈牙有嚼勁；注意：官也街分店已歇業，請前往議事亭前地店用餐！'
  },
  '莫義記': {
    must_order: '馬來西亞貓山王榴槤雪糕（MOP 68）、招牌木糠布丁（MOP 35）、芒果大菜糕（MOP 20）',
    hours: '每日 09:30–22:00',
    price: '人均約 MOP 30–70',
    tips: '米其林街頭小吃推薦，木糠布丁餅乾碎奶香交融，榴槤雪糕香氣濃郁。'
  },
  '大三巴牌坊': {
    must_order: '世界文化遺產石雕立面拍照、後方天主教藝術博物館與墓室、順遊右側浪漫粉色「戀愛巷」',
    hours: '牌坊全天 24 小時；博物館 09:00–18:00（週二下午公休）',
    price: '免費參觀',
    photo: 'https://images.unsplash.com/photo-1552554746-cf8534063220?w=600&auto=format&fit=crop&q=80',
    tips: '建議早上 09:30 前抵達人潮較少，大三巴階梯拍完直接拐入戀愛巷拍照絕美。'
  },
  '澳門倫敦人': {
    must_order: '1:1 等比例伊莉莎白塔大笨鐘、皇家衛隊換崗沉浸式光影秀、英倫復古紅巴士',
    hours: '外觀全天 24 小時；換崗秀每晚 19:30–21:30 逢正半點演出',
    price: '免費參觀欣賞',
    photo: 'https://images.unsplash.com/photo-1518684079-3c830dcef090?w=600&auto=format&fit=crop&q=80',
    tips: '夜間燈光秀金碧輝煌，水晶金殿內華麗非凡，拍照極度震撼。'
  },
  '澳門巴黎人': {
    must_order: '1:2 比例巴黎艾菲爾鐵塔夜間燈光秀、鐵塔 7 樓/37 樓觀景台',
    hours: '鐵塔外觀燈光秀 18:15–24:00（每 15 分鐘一次）；觀景台 12:00–22:00',
    price: '外觀免費欣賞拍照；觀景台門票約 MOP 98',
    photo: 'https://images.unsplash.com/photo-1518684079-3c830dcef090?w=600&auto=format&fit=crop&q=80',
    tips: '最佳拍照角度在對面巴黎人花園草坪，坐在草地上拍全景無遮擋。'
  },

  // 深圳美食、購物與景點
  '蘩樓（老牌早茶）': {
    must_order: '蘩樓露筍蝦餃皇（¥38）、香脆明蝦紅米腸（¥36）、XO醬山椒蒸鳳爪（¥34）、笑口叉燒包（¥28）',
    hours: '早市 09:00–16:00、晚市 17:00–21:30',
    price: '茶位費 ¥6–8/人，人均約 ¥90–120',
    photo: 'https://images.unsplash.com/photo-1541696432-82c6da8ce7bf?w=600&auto=format&fit=crop&q=80',
    tips: '深圳超人氣老牌粵式早茶！大紅燈籠西關復古大宅風格，平日 11:30 前結帳常有早茶 88 折優惠。'
  },
  '潤園四季椰子雞': {
    must_order: '竹笙椰子雞火鍋（半隻約 ¥95，整隻約 ¥150）、經典臘味煲仔飯（小份 ¥48）、珍珠小馬蹄、沙姜金桔秘製沾醬',
    hours: '每日 11:00–22:00',
    price: '人均約 ¥110–130',
    photo: 'https://images.unsplash.com/photo-1547928576-a4a33237cbc3?w=600&auto=format&fit=crop&q=80',
    tips: '深圳椰子雞天花板！純椰青水下鍋煮 5 分鐘先喝湯、再吃嫩雞，配沙姜青檸沾醬酸爽開胃。'
  },
  '八合里牛肉火鍋': {
    must_order: '現切吊龍（¥38）、匙柄（¥36）、三花趾（¥42）、手打生牛肉丸爆汁（¥32）、乾炒牛河（¥35）',
    hours: '每日 11:30–22:00（部分店至 24:00）',
    price: '每盤肉約 ¥28–42，人均約 ¥100–130',
    photo: 'https://images.unsplash.com/photo-1547928576-a4a33237cbc3?w=600&auto=format&fit=crop&q=80',
    tips: '汕頭新鮮直送溫體牛！盤子上標明川燙秒數（8-10秒），沾沙茶醬絕配，大眾點評常有雙人/三人團購優惠。'
  },
  '春滿園': {
    must_order: '晶瑩鮮蝦餃（¥32）、蟹籽燒賣皇（¥30）、現拉牛肉腸粉（¥26）、金牌酥皮叉燒包（¥28）',
    hours: '早市 08:30–14:30、晚市 17:30–21:30',
    price: '人均約 ¥75–100',
    tips: '深圳老牌粵菜點心名店，環境大器舒適，回程日 2/2 悠閒早茶首選。'
  },
  '太二酸菜魚': {
    must_order: '老壇子酸菜魚（2–3人份約 ¥128，魚肉滑嫩酸菜爽脆）、脆椒小酥肉（¥28）、蛋酥軟糍粑（¥22）',
    hours: '11:00–14:00、17:00–21:00',
    price: '人均約 ¥85–105',
    tips: '號稱「酸菜比魚好吃」，泡茶區有免費洛神花陳皮茶可自助暢飲。'
  },
  '鮑師傅糕點': {
    must_order: '海苔風味肉鬆小貝（稱重約 ¥32/斤，外皮鬆軟裹厚厚肉鬆，爆漿沙拉醬）、鱈貝、原味核桃酥',
    hours: '每日 10:00–22:30',
    price: '小貝每盒約 ¥25–35',
    tips: '東門必買伴手禮！現場出爐香氣撲鼻，帶回飯店當宵夜或帶回台灣都很棒。'
  },
  '東門新白馬・次元9號': {
    must_order: '整棟 6 層二次元主題動漫聖地（次元GO、三月獸、模玩熊）：最新正版手辦模型、一番賞抽獎、盲盒、谷子周邊',
    hours: '每日 10:00–22:00（下午至晚間最熱鬧）',
    price: '免費入場逛街；盲盒/谷子約 ¥25–80，景品手辦約 ¥90–200+',
    photo: 'https://images.unsplash.com/photo-1563089145-599997674d42?w=600&auto=format&fit=crop&q=80',
    tips: '青少年動漫愛好者天堂！各樓層分類清楚，手辦模型與官方週邊齊全。'
  },
  'MINISO LAND': {
    must_order: '解放路名仕商城 3 層 IP 旗艦樂園：三麗鷗家族、吉伊卡哇（Chiikawa）、哈利波特、迪士尼正版文創公仔',
    hours: '每日 10:00–23:00',
    price: '文創周邊約 ¥15–150',
    tips: '全亞洲最大 MINISO 旗艦樂園，打卡造景超多，商品比一般門市齊全很多。'
  },
  '賽格電子市場': {
    must_order: '1–4 樓晶片零件，5–8 樓電腦 DIY、客製化機械鍵盤軸體與鍵帽、穿越無人機、潮玩數碼',
    hours: '每日 09:30–18:00（注意：約 17:30 陸續打烊收攤，請下午去）',
    price: '小配件 ¥10–100，客製化鍵盤軸體/套件 ¥200–800+',
    photo: 'https://images.unsplash.com/photo-1519389950473-47ba0277781c?w=600&auto=format&fit=crop&q=80',
    tips: '亞洲最大電子交易市場，喜歡電腦科技的青少年必逛！記得多比價。'
  },
  '深圳人才公園': {
    must_order: '後海天際線摩天樓璀璨夜景、華潤「春筍」巨塔倒映湖水、美團無人機外賣空中空投起降點體驗',
    hours: '公園 06:00–23:00（燈光秀通常週五六日 19:30–21:00）',
    price: '免費開放',
    photo: 'https://images.unsplash.com/photo-1508873696983-2df57046475a?w=600&auto=format&fit=crop&q=80',
    tips: '深圳最具未來科幻感的濱海夜景公園，湖畔步道散步微風舒適。'
  },
  '華強北博物館': {
    must_order: '全沉浸式聲光特展：華強北從農田、BB 機、山寨機到創客之都的傳奇科技奮鬥史',
    hours: '10:00–17:00（16:30 停止入館，週一休館，1/31 週日有開！）',
    price: '免費參觀（需在微信公眾號提前預約）',
    tips: '現代之窗大廈 5 樓，空調舒適互動裝置多，青少年認識科技產業鏈絕佳景點。'
  },
  'DJI 大疆全球旗艦店': {
    must_order: '無人機室內網籠試飛教學、Osmo Pocket 3 口袋相機手持雲台體驗、穿越機模擬器操控',
    hours: '10:00–22:00（週五六至 22:30）',
    price: '免費體驗試玩',
    photo: 'https://images.unsplash.com/photo-1527977966376-1c8408f9f108?w=600&auto=format&fit=crop&q=80',
    tips: '位於萬象天地水廣場，兩層樓極簡科技旗艦店，店員熱情提供無人機試飛教學。'
  }
};

function enrichJson(filePath) {
  if (!fs.existsSync(filePath)) return;
  const data = JSON.parse(fs.readFileSync(filePath, 'utf8'));
  let updated = 0;

  (data.areas || []).forEach(area => {
    ['food', 'shop', 'sights'].forEach(kind => {
      (area[kind] || []).forEach(item => {
        for (const [key, enrich] of Object.entries(SPOT_ENRICHMENTS)) {
          if (item.name && (item.name.includes(key) || key.includes(item.name))) {
            if (enrich.must_order) item.must_order = enrich.must_order;
            if (enrich.hours) item.hours = enrich.hours;
            if (enrich.price) item.price = enrich.price;
            if (enrich.photo) item.photo = enrich.photo;
            if (enrich.tips && !item.tips) item.tips = enrich.tips;
            updated++;
            break;
          }
        }
      });
    });
  });

  fs.writeFileSync(filePath, JSON.stringify(data, null, 2), 'utf8');
  console.log(`Enriched ${filePath}: ${updated} items updated`);
}

enrichJson('04_原始研究資料與工具/research_hk.json');
enrichJson('04_原始研究資料與工具/research_macau.json');
enrichJson('04_原始研究資料與工具/research_sz.json');
