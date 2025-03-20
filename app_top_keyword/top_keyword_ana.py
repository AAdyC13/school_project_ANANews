from collections import Counter
from core.models import analysed_news as news
_cached_top_cate_words = None  

def analyze_top_keywords():
    """分析並計算關鍵字"""
    df = news.db_get_all_DataFrame()
    news_categories = ['要聞', '娛樂', '運動', '全球', '社會', '地方', '產經', '股市', '房市', '生活', '寵物',
                       '健康', '橘世代', '文教', '評論', '兩岸', '科技', 'Oops', '閱讀', '旅遊', '雜誌', '報時光',
                       '倡議+', '500輯', '轉角國際', 'NBA', '時尚', '汽車', '棒球', 'HBL', '遊戲', '專題', '網誌', '女子漾']
    
    allowedPOS = ['Na', 'Nb', 'Nc']
    counter_all = Counter()
    top_cate_words = {}

    for category in news_categories:
        df_group = df[df.category == category]
        words_group = []

        for row in df_group.token_pos:
            filtered_words = [word for word, pos in eval(row) if len(word) >= 2 and pos in allowedPOS]
            words_group += filtered_words

        counter = Counter(words_group)
        counter_all += counter
        top_cate_words[category] = counter.most_common(100)

    top_cate_words['全部'] = counter_all.most_common(100)
    return top_cate_words

def top_keyword_ana(category: str)->dict:
    """
    回傳聯合新聞網所有類別的關鍵字及其數量

    Args:
        category (str): 類別

    Returns:
        dict: 關鍵字及其數量
    """
    global _cached_top_cate_words  # 使用全域變數來快取結果
    if _cached_top_cate_words is None:
        _cached_top_cate_words = analyze_top_keywords()  # 只在程式啟動時計算一次
    return _cached_top_cate_words.get(category, {})  # 回傳對應類別的結果