### תיעוד פיתוחים נוספים במידה ומממשים

### יש לקרוא באינטרנט כיצד כותבים מסמך מסוג זה

### ניתן ללמוד כיצד [בלחיצה על הקישור](https://www.markdownguide.org/cheat-sheet/)


# תיעוד שינויים במערכת האתר

מסמך זה מתאר תוספת לאתר.


## ניהול וסידור הזמנות {#orders-management}

### תיאור כללי
בוצעו שינויים בעמוד ההזמנות במטרה לשפר את חווית המשתמש.

### פיצ'רים מרכזיים

#### א. סטטוסים להזמנה
כל הזמנה שויכה לאחד מהסטטוסים הבאים, כפי שמוצג בטבלה:

| סטטוס | תיאור |
| ----------- | ----------- |
| `future` | הזמנה שטרם התקיימה |
| `current` | הזמנה שמתקיימת כעת |
| `past` | הזמנה שהסתיימה |

#### ב. סידור ברירת מחדל
ההזמנות בעמוד מסודרות אוטומטית לפי הלוגיקה הבאה:
1.  הזמנות `current` בראש העמוד
2.  הזמנות `future`
3.  הזמנות `past` בסוף העמוד

#### ג. סינון ואפשרויות נוספות
נוספו מספר כלים לניהול התצוגה. הפיצ'רים שיושמו הם:
- [x] הוספת Checkboxes אדפטיביים המשתנים לפי סטטוס ההזמנה.
- [x] הוספת אפשרות לסינון ההזמנות לפי הסטטוסים השונים.

