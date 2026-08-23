// =========================================================================
//  БАЗОВЫЕ НАСТРОЙКИ И КОНТЕНТ. РЕДАКТИРОВАТЬ ТОЛЬКО ЭТОТ БЛОК!
// =========================================================================

window.siteConfig = {
    "site": {
        "title": "Илья Пилипенко", // Измени на свое имя (отображается в заголовке сайта и мобильном меню).
        "email": "ilpilipenko@gmail.com", // Свой адрес электронной почты.
        "homepageId": "showcaseGallery", // ID страницы, которая будет отображаться по умолчанию при загрузке сайта (например, "gallery1", "bio", "my_text_page").
        "imageRootPath": "./pictures/", // Базовый путь для всех изображений. Убедитесь, что это соответствует вашей структуре папок. Например, если ваши изображения находятся в `files/photos/`, измените на `"./files/photos/"`.
        "logoType": "text", // "text" или "image"
        "logoImagePath": "./files/logo.png", // Путь к изображению логотипа (используется, если logoType: "image")
        "socialLinks": [
            // Здесь ты можешь добавить или удалить ссылки на Instagram, Telegram и т.д.
            { "platform": "Instagram", "url": "https://www.instagram.com/iliya.pilipenko/", "iconClass": "fab fa-instagram" },
            { "platform": "Telegram", "url": "https://t.me/Ilpilipenko", "iconClass": "fab fa-telegram-plane" },
            // Пример для LinkedIn:
            // { "platform": "LinkedIn", "url": "YOUR_LINKEDIN_PROFILE_URL", "iconClass": "fab fa-linkedin" }
        ],
        // НОВЫЕ НАСТРОЙКИ САЙДБАРА
        "sidebar": {
            "enabledDesktop": true, // true: сайдбар включен на десктопе по умолчанию; false: скрыт
            "hideOnHomepage": false, // true: скрыть сайдбар только на главной странице; false: отображать
        }
    },
    "seo": {
        "title": "Илья Пилипенко Портфолио",
        "description": "Портфолио Ильи Пилипенко, документального фотографа.",
        "keywords": "Илья Пилипенко, документальный фотограф, портфолио, фотография, фотожурналистика, искусство, фотограф",
        "author": "Илья Пилипенко",
        // NEW: Open Graph meta tags
        "ogTitle": "Илья Пилипенко Портфолио",
        "ogDescription": "Портфолио Ильи Пилипенко, документального фотографа.",
        "ogImage": "./files/preview.jpg",
        "ogUrl": "https://yourwebsite.com",
        "ogType": "website",
        // NEW: Twitter Card meta tags
        "twitterCard": "summary_large_image",
        "twitterTitle": "Илья Пилипенко Портфолио",
        "twitterDescription": "Портфолио Ильи Пилипенко, документального фотографа.",
        "twitterImage": "./files/preview.jpg",
        // NEW: Favicon
        "favicon": "./files/favicon.png"
    },
    "about": { // Контент для всплывающего окна "Обо мне".
        "title": "Илья Пилипенко", // Заголовок окна.
        "role": "<strong>Фотограф и куратор.</strong>", // Твоя роль/профессия.
        "paragraphs": [ // Абзацы текста. МОЖНО ИСПОЛЬЗОВАТЬ HTML-ТЕГИ! Например, <a href="...">ссылка</a> или <b>жирный текст</b>. Но будь осторожен с ними.
            `Co-founder and editor-in-chief of the now-archived project <a href="https://monogoroda.closeuprussia.com/en/" target="_blank" rel="noopener noreferrer">Invisible Cities,</a><br>`,
            `author of the Telegram channel <a href="https://t.t.me/photoexperience" target="_blank" rel="noopener noreferrer">Photography Experience,</a><br>`,
            `and co-founder of the online photo gallery <a href="https://galleryf11.com/en/" target="_blank" rel="noopener noreferrer">F11.</a>`
        ]
    },
    "navigation": [ // Список пунктов меню в левой боковой панели.
        // "id": уникальное название для этой секции (не меняй, если не знаешь зачем).
        // "label": Текст, который будет виден в меню.
        // "type": не меняй ("gallery", "text", "overlay", "parent", "link").
        // "children": (ТОЛЬКО ДЛЯ type: "parent") массив вложенных пунктов меню.
        // "url": (ТОЛЬКО ДЛЯ type: "link") URL для внешней ссылки.
        { "id": "galleries_menu", "label": "Галереи", "type": "parent", "children": [
            { "id": "gallery1", "label": "Галерея 1 (1 Колонка)", "type": "gallery" },
            { "id": "gallery2", "label": "Галерея 2 (2 Колонки)", "type": "gallery" },
            { "id": "gallery3", "label": "Галерея 3 (3 Колонки)", "type": "gallery" },
            { "id": "gallery4", "label": "Галерея 4 (Горизонтальная)", "type": "gallery" },
            { "id": "gallery5", "label": "Галерея 5 (Masonry 2 Колонки)", "type": "gallery" },
            { "id": "gallery6", "label": "Галерея 6 (Masonry 3 Колонки)", "type": "gallery" },
            { "id": "singleImageGallery", "label": "Галерея (По одной картинке)", "type": "gallery" },
            { "id": "showcaseGallery", "label": "Шоукейс (Карусель на весь экран)", "type": "gallery" } // НОВЫЙ ТИП ГАЛЕРЕИ
        ]},
        { "id": "text_pages_menu", "label": "Страницы", "type": "parent", "children": [
            { "id": "bio", "label": "Bio", "type": "text" },
            { "id": "my_text_page", "label": "Моя Текстовая Страница", "type": "text" }
        ]},
        { "id": "external_site", "label": "Google", "type": "link", "url": "https://www.google.com" }
    ],
    "footerNavigation": [ // NEW: Настройки для меню в футере.
        { "id": "aboutOverlay", "label": "About", "type": "overlay" }
        // Добавьте сюда другие элементы, которые хотите видеть в футере
        // Например: { "id": "privacy_policy", "label": "Privacy Policy", "type": "text" }
    ],
    "galleriesData": [ // Это список твоих фотогалерей. Каждый блок {...} - это одна галерея. Ты можешь скопировать готовый блок и изменить его, чтобы добавить новую галерею.
        {
            "id": "gallery1",
            "title": "Галерея 1 (1 Колонка)",
            "folder": "gallery1_images", // ОЧЕНЬ ВАЖНО! Имя папки внутри главной папки `photos/`, где лежат фотографии именно для ЭТОЙ галереи.
            "description": { // Описание галереи. Если не нужно, поставь `null` (без кавычек).
                "text": "Это подробное описание для <strong>Галереи 1</strong>. Здесь можно рассказать о проекте, использованных техниках, идеях, которые легли в основу этой серии фотографий. <br><br>Далее следует дополнительный текст, который изначально скрыт. Он может содержать детали, ссылки или дополнительный контекст, расширяющий понимание представленных работ. Это отличный способ поделиться более глубокой информацией, не перегружая страницу сразу.",
                "displayMode": "toggle" // "toggle", "open", "hidden"
            },
            "imageCount": 100, // !!! САМОЕ ВАЖНОЕ !!! ЭТО КОЛИЧЕСТВО ФОТОГРАФИЙ В ЭТОЙ КОНКРЕТНОЙ ГАЛЕРЕЕ.
            "layoutClass": "gallery-single-column", // меняет внешний вид галереи (выбери один из вариантов: "gallery-single-column", "gallery-two-columns", "gallery-three-columns", "gallery-horizontal-scroll", "gallery-masonry-two-columns", "gallery-masonry-three-columns", "gallery-single-image-carousel", "gallery-showcase")
            "hideTitle": false, // Скрывать заголовок страницы?
            "hideCaption": false, // Скрывать подписи к изображениям?
            "hideSidebar": false, // НОВАЯ ОПЦИЯ: Скрыть сайдбар на этой странице
            "seo": { // SEO-теги для этой конкретной страницы. Если не указаны, будут использоваться глобальные.
                "title": "Галерея 1: Одноколоночный макет",
                "description": "Портфолио документальных фотографий в одноколоночном макете.",
                "keywords": "фотография, галерея, одноколоночный, портфолио"
            }
        },
        {
            "id": "gallery2",
            "title": "Галерея 2 (2 Колонки)",
            "folder": "gallery2_images",
            "description": {
                "text": "Краткое описание для Галереи 2. Здесь мы собрали коллекцию работ, посвященных городским пейзажам и повседневной жизни мегаполиса. Вы найдете уникальные перспективы и моменты, запечатленные с вниманием к деталям и атмосфере. Наслаждайтесь просмотром!",
                "displayMode": "open" // "toggle", "open", "hidden"
            },
            "imageCount": 100,
            "layoutClass": "gallery-two-columns",
            "hideTitle": false,
            "hideCaption": false,
            "hideSidebar": false, // НОВАЯ ОПЦИЯ: Скрыть сайдбар на этой странице
            "seo": {
                "title": "Галерея 2: Двухколоночный макет",
                "description": "Коллекция городских пейзажей и моментов в двухколоночном портфолио.",
                "keywords": "город, пейзаж, двухколоночный, фотография"
            }
        },
        {
            "id": "gallery3",
            "title": "Галерея 3 (3 Колонки)",
            "folder": "gallery3_images",
            "description": {
                "text": "Это описание Галереи 3. <br> Здесь может быть <strong>любой HTML</strong> контент, например, <ul><li>списки</li><li>или <em>выделенный текст</em></li></ul>",
                "displayMode": "toggle" // "toggle", "open", "hidden" - пример полного скрытия
            },
            "imageCount": 100,
            "layoutClass": "gallery-three-columns",
            "hideTitle": false,
            "hideCaption": false,
            "hideSidebar": false, // НОВАЯ ОПЦИЯ: Скрыть сайдбар на этой странице
            "seo": {
                "title": "Галерея 3: Трехколоночный макет",
                "description": "Обширная коллекция фотографий, представленная в трехколоночном макете.",
                "keywords": "фото, галерея, трехколоночный, искусство"
            }
        },
        {
            "id": "gallery4",
            "title": "Галерея 4 (Горизонтальная прокрутка)",
            "folder": "gallery4_images",
            "description": {
                "text": "Эта галерея демонстрирует работы в формате горизонтальной прокрутки, идеально подходящие для просмотра на широких экранах. Здесь представлены панорамные снимки и серии, которые лучше воспринимаются при последовательном просмотре слева направо. Попробуйте прокрутить их мышкой или свайпами!",
                "displayMode": "toggle" // "toggle", "open", "hidden"
            },
            "imageCount": 100,
            "layoutClass": "gallery-horizontal-scroll",
            "hideTitle": false,
            "hideCaption": false,
            "hideSidebar": false, // НОВАЯ ОПЦИЯ: Скрыть сайдбар на этой странице
            "captions": [ // Подписи для каждого изображения (индекс соответствует номеру изображения - 1)
                "Величественные горы на закате."
            ],
            "seo": {
                "title": "Галерея 4: Горизонтальная прокрутка",
                "description": "Панорамные и серийные фотографии для горизонтальной прокрутки.",
                "keywords": "панорама, горизонтальная, прокрутка, фотосерии"
            }
        },
        {
            "id": "gallery5",
            "title": "Галерея 5 (Masonry 2 Колонки)",
            "folder": "gallery5_masonry2col",
            "description": {
                "text": "Эта галерея использует макет Masonry в две колонки, позволяя изображениям разной высоты располагаться оптимально, минимизируя пустое пространство. Идеально подходит для смешанных форматов фотографий.",
                "displayMode": "hidden" // "toggle", "open", "hidden"
            },
            "imageCount": 100,
            "layoutClass": "gallery-masonry-two-columns",
            "hideTitle": false,
            "hideCaption": false,
            "hideSidebar": false, // НОВАЯ ОПЦИЯ: Скрыть сайдбар на этой странице
            "captions": [ // Подписи для каждого изображения (индекс соответствует номеру изображения - 1)
                "Величественные горы на закате."
            ],
            "seo": {
                "title": "Галерея 5: Masonry 2 Колонки",
                "description": "Фотографии в макете Masonry с двумя колонками для оптимального отображения.",
                "keywords": "masonry, две колонки, адаптивный, фото"
            }
        },
        {
            "id": "gallery6",
            "title": "Галерея 6 (Masonry 3 Колонки)",
            "folder": "gallery6_masonry3col",
            "description": {
                "text": "Макет Masonry в три колонки для более плотного размещения изображений. Отлично подходит для больших коллекций и создания визуально насыщенных страниц.",
                "displayMode": "hidden" // "toggle", "open", "hidden"
            },
            "imageCount": 100,
            "layoutClass": "gallery-masonry-three-columns",
            "hideTitle": true,
            "hideCaption": false,
            "hideSidebar": false, // НОВАЯ ОПЦИЯ: Скрыть сайдбар на этой странице
            "seo": {
                "title": "Галерея 6: Masonry 3 Колонки",
                "description": "Плотный макет Masonry с тремя колонками для обширных фотоколлекций.",
                "keywords": "masonry, три колонки, галерея, портфолио"
            }
        },
        {
            "id": "singleImageGallery",
            "title": "Галерея (По одной картинке)",
            "folder": "gallery_single_images", // Убедитесь, что эта папка существует и содержит изображения
            "description": {
                "text": "Эта галерея отображает изображения по одному, идеально подходит для детального просмотра. Используйте стрелки навигации или клавиши 'влево'/'вправо' для переключения.",
                "displayMode": "hidden" // "toggle", "open", "hidden"
            },
            "imageCount": 100, // Укажите количество изображений в этой галерее. ЭТО ВАЖНО для цикличной карусели.
            "layoutClass": "gallery-single-image-carousel",
            "hideTitle": true,
            "hideCaption": false, // hideCaption: true - скрывает только подпись, не изображение!
            "hideSidebar": false, // НОВАЯ ОПЦИЯ: Скрыть сайдбар на этой странице
            "captions": [ // Подписи для каждого изображения (индекс соответствует номеру изображения - 1)
                "Величественные горы на закате.",
                "Спокойное озеро, отражающее небо.",
                "Древний лес, полный тайн.",
                "Цветущие поля под летним солнцем.",
                "Городской пейзаж ночью.",
                "Морской закат с парусником.",
                "Улицы старого города.",
                "Портрет незнакомца.",
                "Архитектурные формы.",
                "Изменён  на  для лучшей читаемости на светлых изображениях или letterbox.Добавлен z-index: 10, чтобы подпись не перекрывалась другими элементами (например, стрелками навигации)."
            ],
            "carouselConfig": { // NEW: Индивидуальные настройки карусели для этой галереи
                "randomOrder": false, // true: случайный порядок, false: последовательный
                "autoPlay": false,    // true: автоматическое перелистывание, false: ручное
                "autoPlayInterval": 5000, // Интервал в миллисекундах (3000 = 3 секунды)
                "showArrows": true, // Добавлена опция для включения/выключения стрелок навигации
                "showFullscreenButton": true, // NEW: Настройка для кнопки полноэкранного режима
            },
            "seo": {
                "title": "Галерея: Одно изображение",
                "description": "Галерея с поочередным отображением изображений и подписями.",
                "keywords": "одно изображение, галерея, подписи, карусель"
            }
        },
        {
            "id": "showcaseGallery", // Идентификатор для новой галереи Шоукейс
            "title": "Шоукейс (Карусель на весь экран)",
            "folder": "showcase_images", // Папка с изображениями для шоукейса
            "description": {
                "text": "Это демонстрационная галерея с изображениями на весь экран и интерактивными заголовками.",
                "displayMode": "hidden" // "toggle", "open", "hidden"
            },
            "imageCount": 50, // Количество изображений в этой галерее. Укажите реальное количество изображений в папке!
            "layoutClass": "gallery-showcase", // НОВЫЙ КЛАСС МАКЕТА
            "hideTitle": true, // Заголовок страницы скрыт, так как используются заголовки на изображениях
            "hideCaption": true, // Подписи изображений скрыты, так как используются заголовки Шоукейса
            "hideSidebar": false, // НОВАЯ ОПЦИЯ: Скрыть сайдбар на этой странице (обычно для полноэкранных галерей)
            "showcaseData": [ // ДАННЫЕ ДЛЯ ШОУКЕЙСА (теперь 15 записей)
                {
                    "title": "Проект: Уличные Зарисовки",
                    "link": { "url": "#gallery1", "label": "Смотреть галерею", "external": false }
                },
                {
                    "title": "Проект: Городские Пейзажи",
                    "link": { "url": "https://example.com/urban-landscapes", "label": "Узнать больше", "external": true }
                },
                {
                    "title": "История Мегаполиса",
                    "link": null // Нет ссылки
                },
                {
                    "title": "Тихие Улицы",
                    "link": { "url": "#gallery2", "label": "Открыть", "external": false }
                },
                {
                    "title": "Отражения",
                    "link": null
                },
                {
                    "title": "Под небом",
                    "link": null
                },
                {
                    "title": "Эхо Прошлого",
                    "link": null
                },
                {
                    "title": "Диалоги Света",
                    "link": null
                },
                {
                    "title": "Тени Города",
                    "link": null
                },
                {
                    "title": "В движении",
                    "link": null
                },
                {
                    "title": "Моменты",
                    "link": null
                },
                {
                    "title": "Ритмы города",
                    "link": null
                },
                {
                    "title": "Перекрестки",
                    "link": null
                }
            ],
            "carouselConfig": { // Настройки карусели для Шоукейса (аналогично singleImageCarousel)
                "randomOrder": false,
                "autoPlay": true,
                "autoPlayInterval": 7000,
                "showBullets": true, // НОВАЯ НАСТРОЙКА: Показывать буллеты навигации
                "showTitles": true, // НОВАЯ НАСТРОЙКА: Глобально показывать заголовки и затемнение для Шоукейса
            },
            "seo": {
                "title": "Шоукейс: Полноэкранные изображения",
                "description": "Полноэкранные изображения с интерактивными заголовками и ссылками.",
                "keywords": "шоукейс, полноэкранный, карусель, заголовки"
            }
        }
    ],
    "textPagesData": [ // Список текстовых страниц (например, Bio, CV, Контакты).
        {
            "id": "bio", // Должен быть в списке "navigation"
            "title": "Bio", // Заголовок страницы
            "contentMaxWidth": "1200px", // НОВОЕ: Индивидуальная ширина контента для этой страницы
            "paragraphs": [ // Абзавцы текста. МОЖНО ИСПОЛЬЗОВАТЬ HTML-ТЕГИ!
                `<h1>Заголовок H1</h1>`,
                `<h2>Заголовок H2</h2>`,
                `<h3>Заголовок H3</h3>`,
                `<strong>Илья Пилипенко</strong> – фотограф и куратор, чьи работы исследуют взаимодействие человека с окружающей средой и трансформацию городского ландшафта. Родившись в 1985 году в Киеве, Илья с раннего возраста проявил интерес к визуальному искусству и фотографии как средству документирования и интерпретации реальности.`,
                `Его ранние проекты фокусировались на заброшенных промышленных зонах и их скрытой красоте. Со временем его подход эволюционировал, включив более глубокое осмысление социальной динамики и повседневной жизни.`,
                `<p><strong>Список с маркерами:</strong></p>`,
                `<ul>
                    <li>Элемент списка один</li>
                    <li>Элемент списка два</li>
                    <li>Элемент списка три, который очень длинный и должен переноситься на несколько строк, чтобы проверить форматирование и межстрочный интервал.</li>
                </ul>`,
                `<p><strong>Нумерованный список:</strong></p>`,
                `<ol>
                    <li>Первый пункт</li>
                    <li>Второй пункт</li>
                    <li>Третий пункт, тоже длинный для проверки.</li>
                </ol>`,
                `Илья является сооснователем и бывшим главным редактором проекта <a href="https://monogoroda.closeuprussia.com/en/" target="_blank" rel="noopener noreferrer">«Невидимые Города»</a>, целью которого было документирование жизни в малых и средних городах постсоветского пространства. Этот проект получил признание за свой уникальный взгляд на провинциальную Россию и её жителей.`,
                `Параллельно с практикой фотографа, Илья активно занимается кураторской деятельностью. Он автор популярного Telegram-канала <a href="https://t.me/photoexperience" target="_blank" rel="noopener noreferrer">«Опыт фотографии»</a>, где делится аналитическими статьями, обзорами и советами по фотографии, а также курирует выставки молодых талантов.`,
                `В 2022 году Илья стал сооснователем онлайн-галереи <a href="https://galleryf11.com/en/" target="_blank" rel="noopener noreferrer">F11</a>, платформы для демонстрации и продажи работ современных фотографов.`,
                `Работы Ильи Пилипенко выставлялись в различных галереях и музеях, а также публиковались в международных изданиях. Он продолжает свою творческую и исследовательскую деятельность, постоянно ища новые формы выражения и способы взаимодействия со зрителем.`,
                `Для предложений о сотрудничестве или запросов на работы, пожалуйста, свяжитесь по электронной почте: <a href="mailto:ilpilipenko@gmail.com">ilpilipenko@gmail.com</a>`,
                // Пример уже существующих изображений в тексте
                `<img src="./pictures/gallery1_images/02.jpg" alt="Example image in text content">`,
                `<img src="./pictures/gallery1_images/06.jpg" alt="Example image in text content">`,
                // Пример уже существующего видео в тексте
                `<video controls src="./pictures/text_content_images/example_text_video_1.mp4" alt="Example video in text content"></video>`,

                // НОВЫЕ ПРИМЕРЫ ДОБАВЛЕННЫЕ СВЕРХУ
                `<p>-- Новые примеры форматирования --</p>`,
                // Пример цитаты
                `<blockquote>
                    Это моя любимая цитата, которая вдохновляет меня каждый день. Она отлично смотрится в этом новом стиле.
                </blockquote>`,
                `<p>Здесь можно показать две мои работы рядом.</p>`,
                `[gallery:gallery2]`,
                `<p>А вот как выглядит галерея из трёх изображений.</p>`,
                `[gallery:gallery6]`,
                `<p>И, наконец, здесь можно посмотреть одно из моих видео.</p>`,
                `<div class="video-container">
                    <iframe title="Calamity Cat" width="560" height="315" src="https://video.lono.space/videos/embed/tLJbQKHsVx5aUHBRz63pdu" frameborder="0" allowfullscreen="" sandbox="allow-same-origin allow-scripts allow-popups allow-forms"></iframe>
                </div>`
            ],
            "hideTitle": false, // Скрывать заголовок страницы?
            "hideSidebar": false, // НОВАЯ ОПЦИЯ: Скрыть сайдбар на этой странице
            "seo": {
                "title": "Биография Ильи Пилипенко",
                "description": "Подробная биография и творческий путь документального фотографа Ильи Пилипенко.",
                "keywords": "биография, фотограф, куратор, Илья Пилипенко"
            }
        },
        {
            "id": "my_text_page",
            "title": "Дополнительная Текстовая Страница",
            "contentMaxWidth": "1200px", // НОВОЕ: Индивидуальная ширина контента для этой страницы
            "paragraphs": [
                `Это <strong>дополнительная текстовая страница</strong>, которую можно использовать для размещения CV, контактов, списка публикаций или любой другой информации.`,
                `Как и в секции "Bio", здесь можно использовать <em>HTML-теги</em> для форматирования текста, добавления <strong>ссылок</strong>, и так далее.`,
                `Экспериментируйте с контентом, чтобы максимально эффективно использовать эту функциональность для вашего портфолио!`
            ],
            "hideTitle": false, // Скрывать заголовок страницы?
            "hideSidebar": false, // НОВАЯ ОПЦИЯ: Скрыть сайдбар на этой странице
            "seo": {
                "title": "Дополнительная информация",
                "description": "Дополнительная текстовая страница для CV, контактов или публикаций.",
                "keywords": "контакты, CV, публикации, информация"
            }
        }
    ],
    "styles": { // Site styles (accent color and font).
        "defaultTheme": "classic", // Изменено на "classic" как дефолтная тема
        "fontFamily": "'Inter', sans-serif", // Global font for the entire site
        "logoFontFamily": "'Montserrat', sans-serif", // New: Font for the logo (if logoType: "text")
        "logoFontSize": "1.5rem", // NEW: Font size for the text logo on desktop.
        "logoMobileFontSize": "1.25rem", // NEW (Optional): Font size for the text logo in the mobile header.
        "textFontSize": "1.125rem", // Font size for text pages (e.g., "16px", "1.125rem" for text-lg, "1.25rem" for text-xl).
        "contentMaxWidthClass": "max-w-7xl", // Width of the text block and galleries (except horizontal) on large screens (e.g., "max-w-2xl", "max-w-4xl", "max-w-7xl", "max-w-full").
        "sidebarWidth": "300px", // Width of the side menu on desktop (e.g., "250px", "300px").
        // Убраны accentColor и darkAccentColor, так как они теперь в themes
        "h1FontSize": "2.25rem", // Font size for H1 headings (e.g., "3rem", "3.5rem").
        "h2FontSize": "1.6rem", // Font size for H2 headings (e.g., "2rem", "2.5rem"). This also applies to gallery and text page headings.
        "h3FontSize": "1.3rem", // Font size for H3 headings (e.g., "1.5rem", "1.75rem").
        "headingMarginBottom": "1rem", // Bottom margin for all headings (e.g., "1rem", "1.5rem").
        "menuItemSpacing": "0.5rem", // Spacing between menu items (e.g., "1rem", "0.5rem"). Made more compact.
        "paragraphLineHeight": "1.7", // Line height for paragraphs (e.g., "1.5", "1.7").
        "paragraphMarginBottom": "1.2em", // Bottom margin for paragraphs (e.g., "1em", "1.5em").
        "proseLinkUnderline": true, // Underline links in text blocks (`true` or `false`).
        "standaloneImageMaxWidth": "100%", // Maximum width for standalone images in text (e.g., "600px", "100%").
        "videoMaxWidth": "100%", // Maximum width for videos in text blocks (e.g., "600px", "100%").
        "contentAreaPaddingTop": "0rem", // Top padding for all pages (galleries and text).
        "horizontalGalleryMaxHeight": "70vh", // Maximum height of images in a horizontal gallery.
        "showcaseConfig": { // NEW SETTINGS FOR SHOWCASE
            "titleFontSize": "2rem", // Default showcase title font size
            "bulletsColor": "rgba(255, 255, 255, 0.7)", // Color of showcase navigation bullets
            "activeBulletColor": "white", // Color of the active showcase navigation bullet
            "darkThemeBulletsColor": "rgba(0, 0, 0, 0.5)", // Color of bullets for dark theme
            "darkThemeActiveBulletColor": "black", // Color of the active bullet for dark theme
            "titleColorLight": "white", // Color of the showcase title text for the light theme
            "titleColorDark": "var(--showcase-title-color-dark)", // Color of the showcase title text for the dark theme
            "linkColorLight": "#ADD8E6", // Color of the link inside the showcase title for the light theme
            "linkColorDark": "#87CEEB" // Color of the link inside the showcase title for the dark theme
        },
        "themes": { // Новая секция для управления цветами тем
            "classic": {
                "light": {
                    "backgroundColor": "#fefefe",
                    "textColor": "#333",
                    "logoColor": "#000",
                    "aboutLinkColor": "#555",
                    "accentColor": "#2b647b",
                    "hoverAccentColor": "#1a4a58",
                    "buttonBg": "#2b647b",
                    "buttonText": "#fff",
                    "buttonHoverBg": "#1a4a58",
                    "overlayBg": "rgba(255, 255, 255, 0.95)",
                    "overlayInnerBg": "#fff",
                    "boxShadow": "rgba(0, 0, 0, 0.1)",
                    "imageShadow": "rgba(0, 0, 0, 0.05)",
                    "backToTopBg": "rgba(255, 255, 255, 0.5)",
                    "menuBg": "#fefefe",
                    "menuBorder": "#eee",
                    "headerBg": "rgba(255, 255, 255, 0.8)",
                    "headerShadow": "rgba(0, 0, 0, 0.1)",
                    "showcaseTitleColor": "white",
                    "showcaseLinkColor": "#ADD8E6"
                },
                "dark": {
                    "backgroundColor": "#191919",
                    "textColor": "#e0e0e0",
                    "logoColor": "#fff",
                    "aboutLinkColor": "#bbb",
                    "accentColor": "#6fa8dc",
                    "hoverAccentColor": "#a0c9e8",
                    "buttonBg": "#6fa8dc",
                    "buttonText": "#1a1a1a",
                    "buttonHoverBg": "#a0c9e8",
                    "overlayBg": "rgba(54, 54, 54, 0.95)",
                    "overlayInnerBg": "#2a2a2a",
                    "boxShadow": "rgba(255, 255, 255, 0.1)",
                    "imageShadow": "rgba(255, 255, 255, 0.05)",
                    "backToTopBg": "rgba(0, 0, 0, 0.5)",
                    "menuBg": "rgba(26, 26, 26, 0.9)",
                    "menuBorder": "#333",
                    "headerBg": "rgba(26, 26, 26, 0.8)",
                    "headerShadow": "rgba(255, 255, 255, 0.1)",
                    "showcaseTitleColor": "white",
                    "showcaseLinkColor": "#87CEEB"
                }
            },
            "hase": {
                "light": {
                    "backgroundColor": "#f1f0e8",
                    "textColor": "#333333",
                    "logoColor": "#333333",
                    "aboutLinkColor": "#736d65",
                    "accentColor": "#9a482d",
                    "hoverAccentColor": "#7a3a24",
                    "buttonBg": "#9a482d",
                    "buttonText": "#fefefe",
                    "buttonHoverBg": "#7a3a24",
                    "overlayBg": "rgba(241, 240, 232, 0.95)",
                    "overlayInnerBg": "#fefefe",
                    "boxShadow": "rgba(0, 0, 0, 0.1)",
                    "imageShadow": "rgba(0, 0, 0, 0.05)",
                    "backToTopBg": "rgba(241, 240, 232, 0.5)",
                    "menuBg": "#f1f0e8",
                    "menuBorder": "#dddbd4",
                    "headerBg": "rgba(241, 240, 232, 0.8)",
                    "headerShadow": "rgba(0, 0, 0, 0.1)",
                    "showcaseTitleColor": "white",
                    "showcaseLinkColor": "#ADD8E6"
                },
                "dark": {
                    "backgroundColor": "#222529",
                    "textColor": "#b8b8b8",
                    "logoColor": "#f0f0f0",
                    "aboutLinkColor": "#979da5",
                    "accentColor": "#d99175",
                    "hoverAccentColor": "#e1a58e",
                    "buttonBg": "#d99175",
                    "buttonText": "#222529",
                    "buttonHoverBg": "#e1a58e",
                    "overlayBg": "rgba(34, 37, 41, 0.95)",
                    "overlayInnerBg": "#2a2a2a",
                    "boxShadow": "rgba(255, 255, 255, 0.1)",
                    "imageShadow": "rgba(255, 255, 255, 0.05)",
                    "backToTopBg": "rgba(0, 0, 0, 0.5)",
                    "menuBg": "rgba(34, 37, 41, 0.9)",
                    "menuBorder": "#444a50",
                    "headerBg": "rgba(34, 37, 41, 0.8)",
                    "headerShadow": "rgba(255, 255, 255, 0.1)",
                    "showcaseTitleColor": "white",
                    "showcaseLinkColor": "#87CEEB"
                }
            },
            "ocean": {
                "light": {
                    "backgroundColor": "#e0f7fa",
                    "textColor": "#004d40",
                    "logoColor": "#00695c",
                    "aboutLinkColor": "#00695c",
                    "accentColor": "#009688",
                    "hoverAccentColor": "#00796b",
                    "buttonBg": "#009688",
                    "buttonText": "#fff",
                    "buttonHoverBg": "#00796b",
                    "overlayBg": "rgba(224, 247, 250, 0.95)",
                    "overlayInnerBg": "#fff",
                    "boxShadow": "rgba(0, 0, 0, 0.1)",
                    "imageShadow": "rgba(0, 0, 0, 0.05)",
                    "backToTopBg": "rgba(224, 247, 250, 0.5)",
                    "menuBg": "#e0f7fa",
                    "menuBorder": "#b2dfdb",
                    "headerBg": "rgba(224, 247, 250, 0.8)",
                    "headerShadow": "rgba(0, 0, 0, 0.1)",
                    "showcaseTitleColor": "white",
                    "showcaseLinkColor": "#ADD8E6"
                },
                "dark": {
                    "backgroundColor": "#004d40",
                    "textColor": "#e0f2f1",
                    "logoColor": "#fff",
                    "aboutLinkColor": "#80cbc4",
                    "accentColor": "#4db6ac",
                    "hoverAccentColor": "#80cbc4",
                    "buttonBg": "#4db6ac",
                    "buttonText": "#004d40",
                    "buttonHoverBg": "#80cbc4",
                    "overlayBg": "rgba(0, 77, 64, 0.95)",
                    "overlayInnerBg": "#2a2a2a",
                    "boxShadow": "rgba(255, 255, 255, 0.1)",
                    "imageShadow": "rgba(255, 255, 255, 0.05)",
                    "backToTopBg": "rgba(0, 77, 64, 0.5)",
                    "menuBg": "rgba(0, 77, 64, 0.9)",
                    "menuBorder": "#00695c",
                    "headerBg": "rgba(0, 77, 64, 0.8)",
                    "headerShadow": "rgba(255, 255, 255, 0.1)",
                    "showcaseTitleColor": "white",
                    "showcaseLinkColor": "#87CEEB"
                }
            },
            "custom": {
                "light": {
                    "backgroundColor": "#fefefe", // Стартует с Classic light
                    "textColor": "#333",
                    "logoColor": "#000",
                    "aboutLinkColor": "#555",
                    "accentColor": "#2b647b",
                    "hoverAccentColor": "#1a4a58",
                    "buttonBg": "#2b647b",
                    "buttonText": "#fff",
                    "buttonHoverBg": "#1a4a58",
                    "overlayBg": "rgba(255, 255, 255, 0.95)",
                    "overlayInnerBg": "#fff",
                    "boxShadow": "rgba(0, 0, 0, 0.1)",
                    "imageShadow": "rgba(0, 0, 0, 0.05)",
                    "backToTopBg": "rgba(255, 255, 255, 0.5)",
                    "menuBg": "#fefefe",
                    "menuBorder": "#eee",
                    "headerBg": "rgba(255, 255, 255, 0.8)",
                    "headerShadow": "rgba(0, 0, 0, 0.1)",
                    "showcaseTitleColor": "white",
                    "showcaseLinkColor": "#ADD8E6"
                },
                "dark": {
                    "backgroundColor": "#191919", // Стартует с Classic dark
                    "textColor": "#e0e0e0",
                    "logoColor": "#fff",
                    "aboutLinkColor": "#bbb",
                    "accentColor": "#6fa8dc",
                    "hoverAccentColor": "#a0c9e8",
                    "buttonBg": "#6fa8dc",
                    "buttonText": "#1a1a1a",
                    "buttonHoverBg": "#a0c9e8",
                    "overlayBg": "rgba(54, 54, 54, 0.95)",
                    "overlayInnerBg": "#2a2a2a",
                    "boxShadow": "rgba(255, 255, 255, 0.1)",
                    "imageShadow": "rgba(255, 255, 255, 0.05)",
                    "backToTopBg": "rgba(0, 0, 0, 0.5)",
                    "menuBg": "rgba(26, 26, 26, 0.9)",
                    "menuBorder": "#333",
                    "headerBg": "rgba(26, 26, 26, 0.8)",
                    "headerShadow": "rgba(255, 255, 255, 0.1)",
                    "showcaseTitleColor": "white",
                    "showcaseLinkColor": "#87CEEB"
                }
            }
        }
    },
    "lightbox": { // Общие настройки лайтбокса
        "autoFullscreenOnClick": false, // true: автоматический полноэкранный режим при клике; false: отображает иконку полноэкранного режима.
        "lightboxThemeLight": "dark", // 'dark' (по умолчанию) или 'light'. Определяет фон лайтбокса в светлой теме.
        "lightboxThemeDark": "light"  // 'light' (по умолчанию, реверсирует lightTheme). Определяет фон лайтбокса в темной теме.
    },
    "customCode": { // NEW: Дополнительный кастомный CSS и JavaScript
        "customCSS": `
         
        `,
        "customJS": `
            console.log("Custom JavaScript loaded from config!");
        `
    }
};

// =========================================================================
//  КОНЕЦ БЛОКА НАСТРОЕК.
// =========================================================================
