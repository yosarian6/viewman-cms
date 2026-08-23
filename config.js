window.siteConfig = {
  site: {
    title: "Ilia Pilipenko",
    email: "ilpilipenko@gmail.com",
    homepageId: "showcaseGallery",
    imageRootPath: "./pictures/",
    logoType: "text",
    logoImagePath: "./files/logo.png",
    socialLinks: [
      {
        platform: "Instagram",
        url: "https://www.instagram.com/iliya.pilipenko/",
        iconClass: "fab fa-instagram"
      },
      {
        platform: "Telegram",
        url: "https://t.me/Ilpilipenko",
        iconClass: "fab fa-telegram-plane"
      }
    ],
    sidebar: {
      enabledDesktop: true,
      hideOnHomepage: true
    },
    colorTheme: {
      default: "dark",
      manualToggle: true
    },
    protectImages: false,
    robotsTxtGlobal: "index, follow",
    noaiGlobal: false
  },
  seo: {
    title: "Ilia Pilipenko Portfolio",
    description: "Portfolio of Ilia Pilipenko, documentary photographer.",
    keywords: "Ilia Pilipenko, documentary photographer, portfolio, photography, photojournalism, art, photographer",
    author: "Ilia Pilipenko",
    ogTitle: "Ilia Pilipenko Portfolio",
    ogDescription: "Portfolio of Ilia Pilipenko, documentary photographer.",
    ogImage: "./files/preview.jpg",
    ogUrl: "https://yourwebsite.com",
    ogType: "website",
    twitterCard: "summary_large_image",
    twitterTitle: "Ilia Pilipenko Portfolio",
    twitterDescription: "Portfolio of Ilia Pilipenko, documentary photographer.",
    twitterImage: "./files/preview.jpg",
    favicon: "./files/favicon.png",
    noindex: false,
    noai: false
  },
  navigation: [
    {
      id: "galleries_menu",
      label: "Galleries",
      type: "parent",
      children: [
        {
          id: "gallery1",
          label: "Gallery 1 (1 Column)",
          type: "gallery",
          internalId: "gallery1"
        },
        {
          id: "gallery2",
          label: "Gallery 2 (2 Columns)",
          type: "gallery",
          internalId: "gallery2"
        },
        {
          id: "gallery3",
          label: "Gallery 3 (3 Columns)",
          type: "gallery",
          internalId: "gallery3"
        },
        {
          id: "gallery4",
          label: "Gallery 4 (Horizontal)",
          type: "gallery",
          internalId: "gallery4"
        },
        {
          id: "gallery5",
          label: "Gallery 5 (Masonry 2 Columns)",
          type: "gallery",
          internalId: "gallery5"
        },
        {
          id: "gallery6",
          label: "Gallery 6 (Masonry 3 Columns)",
          type: "gallery",
          internalId: "gallery6"
        },
        {
          id: "singleImageGallery",
          label: "Gallery (Single Image)",
          type: "gallery",
          internalId: "singleImageGallery"
        },
        {
          id: "showcaseGallery",
          label: "Showcase (Full-Screen Carousel)",
          type: "gallery",
          internalId: "showcaseGallery"
        }
      ],
      internalId: "galleries_menu"
    },
    {
      id: "text_pages_menu",
      label: "Pages",
      type: "parent",
      children: [
        {
          id: "bio",
          label: "Bio",
          type: "text",
          internalId: "bio"
        },
        {
          id: "my_text_page",
          label: "My Text Page",
          type: "text",
          internalId: "my_text_page"
        }
      ],
      internalId: "text_pages_menu"
    },
    {
      id: "external_site",
      label: "Google",
      type: "link",
      url: "https://www.google.com",
      internalId: "external_site"
    }
  ],
  footerNavigation: [
    {
      id: "contact",
      label: "Contacts",
      type: "overlay",
      internalId: "contact"
    }
  ],
  galleriesData: [
    {
      id: "gallery1",
      title: "Gallery 1 (1 Column)",
      folder: "gallery1_images",
      description: {
        text: "<p>This is a detailed description for <strong>Gallery 1</strong>. Here you can tell about the project, techniques used, ideas that formed the basis of this series of photographs. <br><br>Further follows additional text that is initially hidden. It may contain details, links, or additional context that enhances the understanding of the presented works. This is a great way to share deeper information without overloading the page immediately.</p>",
        displayMode: "toggle"
      },
      imageCount: 7,
      layoutClass: "gallery-single-column",
      hideTitle: false,
      hideCaption: true,
      hideSidebar: false,
      isProjectGallery: true,
      projectData: [
        {
          title: "Project 1: Urbanism",
          url: "https://example.com/project1",
          description: "Photo project about urban environments and the architecture of metropolises."
        },
        {
          title: "Project 2: Northern Nature",
          url: "#gallery2",
          description: "A series of shots of the wild nature of the Arctic and subarctic."
        },
        {
          title: "Interview with the Author",
          url: "https://vimeo.com/123456789",
          description: "Video interview about inspiration and working methods."
        },
        {
          title: "Exhibition in Paris",
          url: "https://paris-gallery.com/exhibition",
          description: "Solo exhibition at Le Marais gallery, 2024."
        },
        {
          title: "Photo Book",
          url: "#book",
          description: "Limited edition with author’s commentary."
        },
        {
          title: "Masterclass",
          url: "https://workshop.example.com",
          description: "Online course on documentary photography."
        },
        {
          title: "Contacts",
          url: "#contact",
          description: "Contact form and social media."
        }
      ],
      seo: {
        title: "Gallery 1: Single-Column Layout",
        description: "Portfolio of documentary photographs in a single-column layout.",
        keywords: "photography, gallery, single-column, portfolio"
      }
    },
    {
      id: "gallery2",
      title: "Gallery 2 (2 Columns)",
      folder: "gallery2_images",
      description: {
        text: "<p>Brief description for Gallery 2. Here we have collected a series of works dedicated to urban landscapes and the daily life of a metropolis. You will find unique perspectives and moments captured with attention to detail and atmosphere. Enjoy the viewing!</p>",
        displayMode: "open"
      },
      imageCount: 100,
      layoutClass: "gallery-two-columns",
      hideTitle: false,
      hideCaption: false,
      hideSidebar: false,
      seo: {
        title: "Gallery 2: Two-Column Layout",
        description: "Collection of urban landscapes and moments in a two-column portfolio.",
        keywords: "city, landscape, two-column, photography"
      },
      isProjectGallery: false,
      projectData: []
    },
    {
      id: "gallery3",
      title: "Gallery 3 (3 Columns)",
      folder: "gallery3_images",
      description: {
        text: "<p>This is the description for Gallery 3. <br>Here can be <strong>any HTML</strong> content, for example,</p>\n<ul>\n<li>lists</li>\n<li>or <em>emphasized text</em></li>\n</ul>",
        displayMode: "toggle"
      },
      imageCount: 100,
      layoutClass: "gallery-three-columns",
      hideTitle: false,
      hideCaption: false,
      hideSidebar: false,
      seo: {
        title: "Gallery 3: Three-Column Layout",
        description: "Extensive collection of photographs presented in a three-column layout.",
        keywords: "photo, gallery, three-column, art"
      },
      isProjectGallery: false,
      projectData: []
    },
    {
      id: "gallery4",
      title: "Gallery 4 (Horizontal Scroll)",
      folder: "gallery4_images",
      description: {
        text: "<p>This gallery showcases works in a horizontal scroll format, ideal for viewing on wide screens. It features panoramic shots and series that are best experienced by scrolling sequentially from left to right. Try scrolling with your mouse or swipes!</p>",
        displayMode: "toggle"
      },
      imageCount: 100,
      layoutClass: "gallery-horizontal-scroll",
      hideTitle: false,
      hideCaption: false,
      hideSidebar: false,
      captions: [
        "Majestic mountains at sunset."
      ],
      seo: {
        title: "Gallery 4: Horizontal Scroll",
        description: "Panoramic and serial photographs for horizontal scrolling.",
        keywords: "panorama, horizontal, scroll, photo series"
      },
      isProjectGallery: false,
      projectData: []
    },
    {
      id: "gallery5",
      title: "Gallery 5 (Masonry 2 Columns)",
      folder: "gallery5_masonry2col",
      description: {
        text: "<p>This gallery uses a two-column Masonry layout, allowing images of different heights to be arranged optimally, minimizing empty space. Ideal for mixed-format photographs.</p>",
        displayMode: "hidden"
      },
      imageCount: 100,
      layoutClass: "gallery-masonry-two-columns",
      hideTitle: false,
      hideCaption: false,
      hideSidebar: false,
      captions: [
        "Majestic mountains at sunset."
      ],
      seo: {
        title: "Gallery 5: Masonry 2 Columns",
        description: "Photographs in a Masonry layout with two columns for optimal display.",
        keywords: "masonry, two columns, adaptive, photo"
      },
      isProjectGallery: false,
      projectData: []
    },
    {
      id: "gallery6",
      title: "Gallery 6 (Masonry 3 Columns)",
      folder: "gallery6_masonry3col",
      description: {
        text: "<p>Three-column Masonry layout for denser image placement. Perfect for large collections and creating visually rich pages.</p>",
        displayMode: "hidden"
      },
      imageCount: 100,
      layoutClass: "gallery-masonry-three-columns",
      hideTitle: true,
      hideCaption: false,
      hideSidebar: false,
      seo: {
        title: "Gallery 6: Masonry 3 Columns",
        description: "Dense Masonry layout with three columns for extensive photo collections.",
        keywords: "masonry, three columns, gallery, portfolio"
      },
      isProjectGallery: false,
      projectData: []
    },
    {
      id: "singleImageGallery",
      title: "Gallery (Single Image)",
      folder: "gallery_single_images",
      description: {
        text: "<p>This gallery displays images one at a time, ideal for detailed viewing. Use navigation arrows or 'left'/'right' keys to switch.</p>",
        displayMode: "hidden"
      },
      imageCount: 100,
      layoutClass: "gallery-single-image-carousel",
      hideTitle: true,
      hideCaption: false,
      hideSidebar: false,
      captions: [
        "Majestic mountains at sunset.",
        "Calm lake reflecting the sky.",
        "Ancient forest full of mysteries.",
        "Blooming fields under the summer sun.",
        "Cityscape at night.",
        "Sea sunset with a sailboat.",
        "Streets of the old town.",
        "Portrait of a stranger.",
        "Architectural forms.",
        "Modified for better readability on light images or letterbox. Added z-index: 10 to prevent captions from being overlapped by other elements (e.g., navigation arrows)."
      ],
      carouselConfig: {
        randomOrder: false,
        autoPlay: false,
        autoPlayInterval: 5000,
        showArrows: true,
        showFullscreenButton: true
      },
      seo: {
        title: "Gallery: Single Image",
        description: "Gallery with sequential display of images and captions.",
        keywords: "single image, gallery, captions, carousel"
      },
      isProjectGallery: false,
      projectData: []
    },
    {
      id: "showcaseGallery",
      title: "Showcase (Full-Screen Carousel)",
      folder: "showcase_images",
      description: {
        text: "<p>This is a showcase gallery with full-screen images and interactive titles.</p>",
        displayMode: "hidden"
      },
      imageCount: 50,
      layoutClass: "gallery-showcase",
      hideTitle: true,
      hideCaption: true,
      hideSidebar: false,
      showcaseData: [
        {
          title: "Project: Street Sketches",
          link: {
            url: "#gallery1",
            label: "View Gallery",
            external: false
          }
        },
        {
          title: "Project: Urban Landscapes",
          link: {
            url: "https://example.com/urban-landscapes",
            label: "Learn More",
            external: true
          }
        },
        {
          title: "Metropolis Story",
          link: null
        },
        {
          title: "Quiet Streets",
          link: {
            url: "#gallery2",
            label: "Open",
            external: false
          }
        },
        {
          title: "Reflections",
          link: null
        },
        {
          title: "Under the Sky",
          link: null
        },
        {
          title: "Echoes of the Past",
          link: null
        },
        {
          title: "Light Dialogues",
          link: null
        },
        {
          title: "City Shadows",
          link: null
        },
        {
          title: "In Motion",
          link: null
        },
        {
          title: "Moments",
          link: null
        },
        {
          title: "City Rhythms",
          link: null
        },
        {
          title: "Crossroads",
          link: null
        }
      ],
      carouselConfig: {
        randomOrder: false,
        autoPlay: false,
        autoPlayInterval: 7000,
        showBullets: true,
        showTitles: true
      },
      seo: {
        title: "Showcase: Full-Screen Images",
        description: "Full-screen images with interactive titles and links.",
        keywords: "showcase, full-screen, carousel, titles"
      },
      isProjectGallery: false,
      projectData: []
    }
  ],
  textPagesData: [
    {
      id: "bio",
      title: "Bio",
      contentMaxWidth: "1200px",
      hideTitle: false,
      hideSidebar: false,
      seo: {
        title: "Ilia Pilipenko Biography",
        description: "Detailed biography and creative journey of documentary photographer Ilia Pilipenko.",
        keywords: "biography, photographer, curator, Ilia Pilipenko"
      },
      contentHtml: "<h1>Heading H1</h1>\n<h2>Heading H2</h2>\n<h3>Heading H3</h3>\n<p><strong>Ilia Pilipenko</strong> – photographer and curator whose works explore the interaction of humans with their environment and the transformation of urban landscapes. Born in 1985 in Kyiv, Ilia showed an early interest in visual arts and photography as a means of documenting and interpreting reality.</p>\n<p>His early projects focused on abandoned industrial zones and their hidden beauty. Over time, his approach evolved to include a deeper reflection on social dynamics and everyday life.</p>\n<p><strong>Bullet List:</strong></p>\n<ul>\n<li>List item one</li>\n<li>List item two</li>\n<li>List item three, which is very long and should wrap to multiple lines to test formatting and line spacing.</li>\n</ul>\n<p><strong>Numbered List:</strong></p>\n<ol>\n<li>First item</li>\n<li>Second item</li>\n<li>Third item, also long for testing.</li>\n</ol>\n<p>Ilia is a co-founder and former editor-in-chief of the project <a href=\"https://monogoroda.closeuprussia.com/en/\" target=\"_blank\" rel=\"noopener noreferrer\">“Invisible Cities”</a>, aimed at documenting life in small and medium-sized cities of the post-Soviet space. This project gained recognition for its unique perspective on provincial Russia and its inhabitants.</p>\n<p>In parallel with his photography practice, Ilia is actively engaged in curatorial activities. He is the author of the popular Telegram channel <a href=\"https://t.me/photoexperience\" target=\"_blank\" rel=\"noopener noreferrer\">“Photography Experience”</a>, where he shares analytical articles, reviews, and photography tips, as well as curates exhibitions of young talents.</p>\n<p>In 2022, Ilia co-founded the online gallery <a href=\"https://galleryf11.com/en/\" target=\"_blank\" rel=\"noopener noreferrer\">F11</a>, a platform for showcasing and selling works by contemporary photographers.</p>\n<p>Ilia Pilipenko’s works have been exhibited in various galleries and museums and published in international publications. He continues his creative and research activities, constantly seeking new forms of expression and ways to engage with the audience.</p>\n<p>For collaboration proposals or inquiries about works, please contact via email: <a href=\"mailto:ilpilipenko@gmail.com\">ilpilipenko@gmail.com</a></p>\n<p><img src=\"pictures/gallery1_images/02.jpg\" alt=\"Example image in text content\"></p>\n<p><img src=\"pictures/gallery1_images/06.jpg\" alt=\"Example image in text content\"></p>\n<p><video width=\"300\" height=\"150\" controls=\"controls\" src=\"pictures/text_content_images/example_text_video_1.mp4\" alt=\"Example video in text content\"></video></p>\n<p>-- New formatting examples --</p>\n<blockquote>This is my favorite quote that inspires me every day. It looks great in this new style.</blockquote>\n<p>Here I can showcase two of my works side by side.</p>\n[gallery:gallery2]\n<p>And here’s how a gallery of three images looks.</p>\n[gallery:gallery6]\n<p>Finally, here you can watch one of my videos.</p>\n<div class=\"video-container\"><iframe width=\"560\" height=\"315\" title=\"Calamity Cat\" src=\"https://video.lono.space/videos/embed/tLJbQKHsVx5aUHBRz63pdu\" frameborder=\"0\" allowfullscreen=\"allowfullscreen\" sandbox=\"allow-same-origin allow-scripts allow-popups allow-forms\"></iframe></div>"
    },
    {
      id: "my_text_page",
      title: "Additional Text Page",
      contentMaxWidth: "1200px",
      hideTitle: false,
      hideSidebar: false,
      seo: {
        title: "Additional Information",
        description: "Additional text page for CV, contacts, or publications.",
        keywords: "contacts, CV, publications, information"
      },
      contentHtml: "<p>Это <strong>дополнительная текстовая страница</strong>, которую можно использовать для размещения резюме, контактов, списка публикаций или любой другой информации.</p>\n<p>Как и в разделе «Биография», здесь можно использовать <em>HTML-теги</em> для форматирования текста, добавления <strong>ссылок</strong> и так далее.</p>\n<p>Экспериментируйте с контентом, чтобы максимально эффективно использовать этот функционал для вашего портфолио!</p>"
    }
  ],
  styles: {
    fonts: {
      body: {
        family: "Inter",
        customFamily: "",
        weight: "400",
        style: "normal",
        decoration: "none",
        transform: "none"
      },
      headings: {
        family: "Inter",
        customFamily: "",
        weight: "700",
        style: "normal",
        decoration: "none",
        transform: "none"
      },
      logo: {
        family: "Manrope",
        customFamily: "",
        weight: "700",
        style: "normal",
        decoration: "none",
        transform: "uppercase"
      }
    },
    fontSource: "google",
    localFonts: [
      "Inter",
      "IBM Plex Sans",
      "IBM Plex Serif",
      "IBM Plex Mono",
      "Source Sans 3",
      "Source Serif 4",
      "Source Code Pro",
      "Noto Sans",
      "Noto Serif",
      "Work Sans",
      "Manrope",
      "Rubik",
      "Open Sans",
      "Public Sans",
      "Red Hat Display",
      "Playfair Display",
      "Cormorant Garamond",
      "Spectral",
      "Crimson Pro",
      "EB Garamond",
      "Merriweather",
      "Merriweather Sans",
      "Bitter",
      "Fraunces",
      "Literata",
      "Vollkorn",
      "Space Grotesk",
      "Space Mono",
      "JetBrains Mono",
      "Exo 2",
      "Fira Sans",
      "Fira Mono",
      "Barlow",
      "Archivo",
      "Urbanist",
      "Karla",
      "Cabinet Grotesk",
      "Satoshi"
    ],
    googleFonts: [
      "Inter",
      "Roboto",
      "Open Sans",
      "Lato",
      "Montserrat",
      "Raleway",
      "Ubuntu",
      "PT Sans",
      "Noto Sans",
      "Work Sans",
      "Manrope",
      "Rubik",
      "Public Sans",
      "Red Hat Display",
      "Barlow",
      "Archivo",
      "Urbanist",
      "Karla",
      "Exo 2",
      "Fira Sans",
      "IBM Plex Sans",
      "Source Sans 3",
      "Space Grotesk",
      "Satoshi",
      "Cabin",
      "Quicksand",
      "Poppins",
      "DM Sans",
      "Jost",
      "Lexend",
      "Figtree",
      "Plus Jakarta Sans",
      "Outfit",
      "Readex Pro",
      "Commissioner",
      "Anek Latin",
      "Anek Devanagari",
      "Anek Telugu",
      "Anek Gujarati",
      "Anek Bangla",
      "Anek Odia",
      "Anek Malayalam",
      "Anek Kannada",
      "Anek Tamil",
      "Playfair Display",
      "Merriweather",
      "Lora",
      "PT Serif",
      "Noto Serif",
      "Source Serif 4",
      "Crimson Pro",
      "EB Garamond",
      "Libre Baskerville",
      "Cormorant Garamond",
      "Spectral",
      "Fraunces",
      "Literata",
      "Vollkorn",
      "IBM Plex Serif",
      "DM Serif Display",
      "Zilla Slab",
      "Newsreader",
      "Faustina",
      "Bitter",
      "Cinzel",
      "Abril Fatface",
      "Oswald",
      "Alegreya",
      "IBM Plex Mono",
      "Source Code Pro",
      "Fira Mono",
      "JetBrains Mono",
      "Space Mono",
      "Roboto Mono",
      "Inconsolata",
      "Cousine",
      "Ubuntu Mono",
      "Share Tech Mono"
    ],
    logoFontSize: "1.5rem",
    logoMobileFontSize: "1.25rem",
    textFontSize: "1.125rem",
    contentMaxWidthClass: "max-w-7xl",
    sidebarWidth: "300px",
    accentColor: "#2b647b",
    darkAccentColor: "#6dd5ed",
    h1FontSize: "2.25rem",
    h2FontSize: "1.6rem",
    h3FontSize: "1.3rem",
    headingMarginBottom: "1rem",
    menuItemSpacing: "0.5rem",
    paragraphLineHeight: "1.7",
    paragraphMarginBottom: "1.2em",
    proseLinkUnderline: true,
    standaloneImageMaxWidth: "100%",
    videoMaxWidth: "100%",
    contentAreaPaddingTop: "0rem",
    horizontalGalleryMaxHeight: "70vh",
    projectGalleryOverlay: {
      titleFontSize: "1.5rem",
      descriptionFontSize: "1rem",
      titleColor: "white",
      descriptionColor: "#cfcfcf",
      linkColor: "white",
      textColor: "white",
      alwaysVisibleDesktop: false
    },
    showcaseConfig: {
      titleFontSize: "2rem",
      bulletsColor: "rgba(255, 255, 255, 0.7)",
      activeBulletColor: "white",
      darkThemeBulletsColor: "rgba(0, 0, 0, 0.5)",
      darkThemeActiveBulletColor: "black",
      titleColorLight: "white",
      titleColorDark: "var(--showcase-title-color-dark)",
      linkColorLight: "#ADD8E6",
      linkColorDark: "#87CEEB"
    },
    defaultTheme: "hase",
    themes: {
      classic: {
        light: {
          backgroundColor: "#fefefe",
          textColor: "#333",
          logoColor: "#000",
          accentColor: "#2b647b",
          hoverAccentColor: "#1a4a58",
          buttonBg: "#2b647b",
          buttonText: "#fff",
          buttonHoverBg: "#1a4a58",
          overlayBg: "rgba(255, 255, 255, 0.95)",
          overlayInnerBg: "#fff",
          boxShadow: "rgba(0, 0, 0, 0.1)",
          imageShadow: "rgba(0, 0, 0, 0.05)",
          backToTopBg: "rgba(255, 255, 255, 0.5)",
          menuBg: "#fefefe",
          menuBorder: "#eee",
          headerBg: "rgba(255, 255, 255, 0.8)",
          headerShadow: "rgba(0, 0, 0, 0.1)",
          showcaseTitleColor: "white",
          showcaseLinkColor: "#ADD8E6"
        },
        dark: {
          backgroundColor: "#191919",
          textColor: "#e0e0e0",
          logoColor: "#fff",
          accentColor: "#6fa8dc",
          hoverAccentColor: "#a0c9e8",
          buttonBg: "#6fa8dc",
          buttonText: "#1a1a1a",
          buttonHoverBg: "#a0c9e8",
          overlayBg: "rgba(54, 54, 54, 0.95)",
          overlayInnerBg: "#2a2a2a",
          boxShadow: "rgba(255, 255, 255, 0.1)",
          imageShadow: "rgba(255, 255, 255, 0.05)",
          backToTopBg: "rgba(0, 0, 0, 0.5)",
          menuBg: "rgba(26, 26, 26, 0.9)",
          menuBorder: "#333",
          headerBg: "rgba(26, 26, 26, 0.8)",
          headerShadow: "rgba(255, 255, 255, 0.1)",
          showcaseTitleColor: "white",
          showcaseLinkColor: "#87CEEB"
        }
      },
      hase: {
        light: {
          backgroundColor: "#f1f0e8",
          textColor: "#333333",
          logoColor: "#333333",
          accentColor: "#9a482d",
          hoverAccentColor: "#7a3a24",
          buttonBg: "#9a482d",
          buttonText: "#fefefe",
          buttonHoverBg: "#7a3a24",
          overlayBg: "rgba(241, 240, 232, 0.95)",
          overlayInnerBg: "#fefefe",
          boxShadow: "rgba(0, 0, 0, 0.1)",
          imageShadow: "rgba(0, 0, 0, 0.05)",
          backToTopBg: "rgba(241, 240, 232, 0.5)",
          menuBg: "#f1f0e8",
          menuBorder: "#dddbd4",
          headerBg: "rgba(241, 240, 232, 0.8)",
          headerShadow: "rgba(0, 0, 0, 0.1)",
          showcaseTitleColor: "white",
          showcaseLinkColor: "#ADD8E6"
        },
        dark: {
          backgroundColor: "#222529",
          textColor: "#b8b8b8",
          logoColor: "#f0f0f0",
          accentColor: "#d99175",
          hoverAccentColor: "#e1a58e",
          buttonBg: "#d99175",
          buttonText: "#222529",
          buttonHoverBg: "#e1a58e",
          overlayBg: "rgba(34, 37, 41, 0.95)",
          overlayInnerBg: "#2a2a2a",
          boxShadow: "rgba(255, 255, 255, 0.1)",
          imageShadow: "rgba(255, 255, 255, 0.05)",
          backToTopBg: "rgba(0, 0, 0, 0.5)",
          menuBg: "rgba(34, 37, 41, 0.9)",
          menuBorder: "#444a50",
          headerBg: "rgba(34, 37, 41, 0.8)",
          headerShadow: "rgba(255, 255, 255, 0.1)",
          showcaseTitleColor: "white",
          showcaseLinkColor: "#87CEEB"
        }
      },
      ocean: {
        light: {
          backgroundColor: "#e0f7fa",
          textColor: "#004d40",
          logoColor: "#00695c",
          accentColor: "#009688",
          hoverAccentColor: "#00796b",
          buttonBg: "#009688",
          buttonText: "#fff",
          buttonHoverBg: "#00796b",
          overlayBg: "rgba(224, 247, 250, 0.95)",
          overlayInnerBg: "#fff",
          boxShadow: "rgba(0, 0, 0, 0.1)",
          imageShadow: "rgba(0, 0, 0, 0.05)",
          backToTopBg: "rgba(224, 247, 250, 0.5)",
          menuBg: "#e0f7fa",
          menuBorder: "#b2dfdb",
          headerBg: "rgba(224, 247, 250, 0.8)",
          headerShadow: "rgba(0, 0, 0, 0.1)",
          showcaseTitleColor: "white",
          showcaseLinkColor: "#ADD8E6"
        },
        dark: {
          backgroundColor: "#004d40",
          textColor: "#e0f2f1",
          logoColor: "#fff",
          accentColor: "#4db6ac",
          hoverAccentColor: "#80cbc4",
          buttonBg: "#4db6ac",
          buttonText: "#004d40",
          buttonHoverBg: "#80cbc4",
          overlayBg: "rgba(0, 77, 64, 0.95)",
          overlayInnerBg: "#2a2a2a",
          boxShadow: "rgba(255, 255, 255, 0.1)",
          imageShadow: "rgba(255, 255, 255, 0.05)",
          backToTopBg: "rgba(0, 77, 64, 0.5)",
          menuBg: "rgba(0, 77, 64, 0.9)",
          menuBorder: "#00695c",
          headerBg: "rgba(0, 77, 64, 0.8)",
          headerShadow: "rgba(255, 255, 255, 0.1)",
          showcaseTitleColor: "white",
          showcaseLinkColor: "#87CEEB"
        }
      },
      custom: {
        light: {
          backgroundColor: "#fefefe",
          textColor: "#333",
          logoColor: "#000",
          accentColor: "#2b647b",
          hoverAccentColor: "#1a4a58",
          buttonBg: "#2b647b",
          buttonText: "#fff",
          buttonHoverBg: "#1a4a58",
          overlayBg: "rgba(255, 255, 255, 0.95)",
          overlayInnerBg: "#fff",
          boxShadow: "rgba(0, 0, 0, 0.1)",
          imageShadow: "rgba(0, 0, 0, 0.05)",
          backToTopBg: "rgba(255, 255, 255, 0.5)",
          menuBg: "#fefefe",
          menuBorder: "#eee",
          headerBg: "rgba(255, 255, 255, 0.8)",
          headerShadow: "rgba(0, 0, 0, 0.1)",
          showcaseTitleColor: "white",
          showcaseLinkColor: "#ADD8E6"
        },
        dark: {
          backgroundColor: "#191919",
          textColor: "#e0e0e0",
          logoColor: "#fff",
          accentColor: "#6fa8dc",
          hoverAccentColor: "#a0c9e8",
          buttonBg: "#6fa8dc",
          buttonText: "#1a1a1a",
          buttonHoverBg: "#a0c9e8",
          overlayBg: "rgba(54, 54, 54, 0.95)",
          overlayInnerBg: "#2a2a2a",
          boxShadow: "rgba(255, 255, 255, 0.1)",
          imageShadow: "rgba(255, 255, 255, 0.05)",
          backToTopBg: "rgba(0, 0, 0, 0.5)",
          menuBg: "rgba(26, 26, 26, 0.9)",
          menuBorder: "#333",
          headerBg: "rgba(26, 26, 26, 0.8)",
          headerShadow: "rgba(255, 255, 255, 0.1)",
          showcaseTitleColor: "white",
          showcaseLinkColor: "#87CEEB"
        }
      }
    },
    displayMode: "manual"
  },
  lightbox: {
    autoFullscreenOnClick: true,
    lightboxThemeLight: "dark",
    lightboxThemeDark: "light",
    transition: "slide",
    slideDuration: 800,
    slideEasing: "ease"
  },
  i18n: {
    enabled: true,
    defaultLanguage: "en",
    defaultFrontendLanguage: "en",      
    autoDetectBrowserLanguage: true,   
    currentLanguage: null,
    available: [
      "ru"
    ],
    fallbackToSource: true,
    autoTranslate: {
      lastTimestamp: null
    }
  },
  translations: {
    ru: {
      updatedAt: 1761323020434,
      seo: {
        title: {
          value: "Портфолио Ильи Пилипенко",
          source: "auto"
        },
        description: {
          value: "Портфолио Ильи Пилипенко, документального фотографа.",
          source: "auto"
        },
        keywords: {
          value: "Илья Пилипенко, документальный фотограф, портфолио, фотография, фотожурналистика, искусство, фотограф",
          source: "auto"
        },
        author: {
          value: "Илья Пилипенко",
          source: "auto"
        },
        ogTitle: {
          value: "Портфолио Ильи Пилипенко",
          source: "auto"
        },
        ogDescription: {
          value: "Портфолио Ильи Пилипенко, документального фотографа.",
          source: "auto"
        },
        ogImage: {
          value: "./files/preview.jpg",
          source: "auto"
        },
        ogUrl: {
          value: "https://yourwebsite.com",
          source: "auto"
        },
        ogType: {
          value: "website",
          source: "auto"
        },
        twitterCard: {
          value: "summary_large_image",
          source: "auto"
        },
        twitterTitle: {
          value: "Портфолио Ильи Пилипенко",
          source: "auto"
        },
        twitterDescription: {
          value: "Портфолио Ильи Пилипенко, документального фотографа.",
          source: "auto"
        },
        twitterImage: {
          value: "./files/preview.jpg",
          source: "auto"
        },
        favicon: {
          value: "./files/favicon.png",
          source: "auto"
        }
      },
      site: {
        title: {
          value: "Илья Пилипенко",
          source: "auto"
        }
      },
      navigation: {
        galleries_menu: {
          label: {
            value: "Галереи",
            source: "auto"
          },
          children: {
            gallery1: {
              label: {
                value: "Галерея 1 (1 Колонка)",
                source: "auto"
              }
            },
            gallery2: {
              label: {
                value: "Галерея 2 (2 Колонки)",
                source: "auto"
              }
            },
            gallery3: {
              label: {
                value: "Галерея 3 (3 Колонки)",
                source: "auto"
              }
            },
            gallery4: {
              label: {
                value: "Галерея 4 (Горизонтальная)",
                source: "auto"
              }
            },
            gallery5: {
              label: {
                value: "Галерея 5 (Масонри 2 Колонки)",
                source: "auto"
              }
            },
            gallery6: {
              label: {
                value: "Галерея 6 (Масонри 3 Колонки)",
                source: "auto"
              }
            },
            singleImageGallery: {
              label: {
                value: "Галерея (По одному изображению)",
                source: "auto"
              }
            },
            showcaseGallery: {
              label: {
                value: "Витрина (Полноэкранная Карусель)",
                source: "auto"
              }
            }
          }
        },
        text_pages_menu: {
          label: {
            value: "Страницы",
            source: "auto"
          },
          children: {
            bio: {
              label: {
                value: "Биография",
                source: "auto"
              }
            },
            my_text_page: {
              label: {
                value: "Моя Текстовая Страница",
                source: "auto"
              }
            },
            external_site: {
              label: {
                value: "Google",
                source: "auto"
              }
            }
          }
        }
      },
      footerNavigation: {
        contact: {
          label: {
            value: "Контакты",
            source: "auto"
          }
        }
      },
      galleriesData: {
        gallery1: {
          title: {
            value: "Галерея 1 (1 Колонка)",
            source: "auto"
          },
          description: {
            value: "<p>Это подробное описание для <strong>Галереи 1</strong>. Здесь можно рассказать о проекте, использованных техниках, идеях, легших в основу этой серии фотографий. <br><br>Далее следует дополнительный текст, который изначально скрыт. Он может содержать детали, ссылки или дополнительный контекст, который расширяет понимание представленных работ. Это отличный способ поделиться более глубокой информацией, не перегружая страницу сразу.</p>",
            source: "auto"
          },
          seo: {
            title: {
              value: "Галерея 1: Одноколоночный Макет",
              source: "auto"
            },
            description: {
              value: "Портфолио документальных фотографий в одноколоночном макете.",
              source: "auto"
            },
            keywords: {
              value: "фотография, галерея, одна колонка, портфолио",
              source: "auto"
            }
          },
          captions: [],
          projectData: [
            {
              title: {
                value: "Проект 1: Урбанизм",
                source: "auto"
              },
              description: {
                value: "Фотопроект о городской среде и архитектуре мегаполисов.",
                source: "auto"
              }
            },
            {
              title: {
                value: "Проект 2: Северная Природа",
                source: "auto"
              },
              description: {
                value: "Серия снимков дикой природы Арктики и субарктики.",
                source: "auto"
              }
            },
            {
              title: {
                value: "Интервью с Автором",
                source: "auto"
              },
              description: {
                value: "Видео-интервью о вдохновении и методах работы.",
                source: "auto"
              }
            },
            {
              title: {
                value: "Выставка в Париже",
                source: "auto"
              },
              description: {
                value: "Персональная выставка в галерее Le Marais, 2024.",
                source: "auto"
              }
            },
            {
              title: {
                value: "Фотокнига",
                source: "auto"
              },
              description: {
                value: "Лимитированное издание с комментариями автора.",
                source: "auto"
              }
            },
            {
              title: {
                value: "Мастер-класс",
                source: "auto"
              },
              description: {
                value: "Онлайн-курс по документальной фотографии.",
                source: "auto"
              }
            },
            {
              title: {
                value: "Контакты",
                source: "auto"
              },
              description: {
                value: "Форма обратной связи и социальные сети.",
                source: "auto"
              }
            }
          ]
        },
        gallery2: {
          title: {
            value: "Галерея 2 (2 Колонки)",
            source: "auto"
          },
          description: {
            value: "<p>Краткое описание для Галереи 2. Здесь собрана серия работ, посвященная городским пейзажам и повседневной жизни мегаполиса. Вы найдете уникальные ракурсы и моменты, запечатленные с вниманием к деталям и атмосфере. Приятного просмотра!</p>",
            source: "auto"
          },
          seo: {
            title: {
              value: "Галерея 2: Двухколоночный Макет",
              source: "auto"
            },
            description: {
              value: "Коллекция городских пейзажей и моментов в двухколоночном портфолио.",
              source: "auto"
            },
            keywords: {
              value: "город, пейзаж, две колонки, фотография",
              source: "auto"
            }
          },
          captions: []
        },
        gallery3: {
          title: {
            value: "Галерея 3 (3 Колонки)",
            source: "auto"
          },
          description: {
            value: "<p>Это описание для Галереи 3. <br>Здесь может быть <strong>любой HTML</strong> контент, например,</p>\n<ul>\n<li>списки</li>\n<li>или <em>выделенный текст</em></li>\n</ul>",
            source: "auto"
          },
          seo: {
            title: {
              value: "Галерея 3: Трехколоночный Макет",
              source: "auto"
            },
            description: {
              value: "Обширная коллекция фотографий, представленная в макете из трех колонок.",
              source: "auto"
            },
            keywords: {
              value: "фото, галерея, три колонки, искусство",
              source: "auto"
            }
          },
          captions: []
        },
        gallery4: {
          title: {
            value: "Галерея 4 (Горизонтальная Прокрутка)",
            source: "auto"
          },
          description: {
            value: "<p>Эта галерея демонстрирует работы в формате горизонтальной прокрутки, идеально подходящем для просмотра на широких экранах. В ней представлены панорамные снимки и серии, которые лучше всего воспринимаются при последовательной прокрутке слева направо. Попробуйте прокрутку мышью или свайпами!</p>",
            source: "auto"
          },
          seo: {
            title: {
              value: "Галерея 4: Горизонтальная Прокрутка",
              source: "auto"
            },
            description: {
              value: "Панорамные и серийные фотографии для горизонтальной прокрутки.",
              source: "auto"
            },
            keywords: {
              value: "панорама, горизонтальная, прокрутка, фотосерия",
              source: "auto"
            }
          },
          captions: [
            {
              value: "Величественные горы на закате.",
              source: "auto"
            }
          ]
        },
        gallery5: {
          title: {
            value: "Галерея 5 (Масонри 2 Колонки)",
            source: "auto"
          },
          description: {
            value: "<p>Эта галерея использует двухколоночный макет Masonry, позволяющий оптимально располагать изображения разной высоты, минимизируя пустое пространство. Идеально подходит для фотографий смешанного формата.</p>",
            source: "auto"
          },
          seo: {
            title: {
              value: "Галерея 5: Масонри 2 Колонки",
              source: "auto"
            },
            description: {
              value: "Фотографии в макете Masonry с двумя колонками для оптимального отображения.",
              source: "auto"
            },
            keywords: {
              value: "масонри, две колонки, адаптивный, фото",
              source: "auto"
            }
          },
          captions: [
            {
              value: "Величественные горы на закате.",
              source: "auto"
            }
          ]
        },
        gallery6: {
          title: {
            value: "Галерея 6 (Масонри 3 Колонки)",
            source: "auto"
          },
          description: {
            value: "<p>Трехколоночный макет Masonry для более плотного размещения изображений. Отлично подходит для больших коллекций и создания визуально насыщенных страниц.</p>",
            source: "auto"
          },
          seo: {
            title: {
              value: "Галерея 6: Масонри 3 Колонки",
              source: "auto"
            },
            description: {
              value: "Плотный макет Masonry с тремя колонками для обширных фотоколлекций.",
              source: "auto"
            },
            keywords: {
              value: "масонри, три колонки, галерея, портфолио",
              source: "auto"
            }
          },
          captions: []
        },
        singleImageGallery: {
          title: {
            value: "Галерея (По одному изображению)",
            source: "auto"
          },
          description: {
            value: "<p>Эта галерея отображает изображения по одному, что идеально подходит для детального просмотра. Используйте стрелки навигации или клавиши 'влево'/'вправо' для переключения.</p>",
            source: "auto"
          },
          seo: {
            title: {
              value: "Галерея: По одному изображению",
              source: "auto"
            },
            description: {
              value: "Галерея с последовательным отображением изображений и подписей.",
              source: "auto"
            },
            keywords: {
              value: "одно изображение, галерея, подписи, карусель",
              source: "auto"
            }
          },
          captions: [
            {
              value: "Величественные горы на закате.",
              source: "auto"
            },
            {
              value: "Спокойное озеро, отражающее небо.",
              source: "auto"
            },
            {
              value: "Древний лес, полный тайн.",
              source: "auto"
            },
            {
              value: "Цветущие поля под летним солнцем.",
              source: "auto"
            },
            {
              value: "Городской пейзаж ночью.",
              source: "auto"
            },
            {
              value: "Морской закат с парусником.",
              source: "auto"
            },
            {
              value: "Улицы старого города.",
              source: "auto"
            },
            {
              value: "Портрет незнакомца.",
              source: "auto"
            },
            {
              value: "Архитектурные формы.",
              source: "auto"
            },
            {
              value: "Модифицировано для лучшей читаемости на светлых изображениях или в формате letterbox. Добавлен z-index: 10, чтобы подписи не перекрывались другими элементами (например, стрелками навигации).",
              source: "auto"
            }
          ]
        },
        showcaseGallery: {
          title: {
            value: "Витрина (Полноэкранная Карусель)",
            source: "auto"
          },
          description: {
            value: "<p>Это витрина-галерея с полноэкранными изображениями и интерактивными заголовками.</p>",
            source: "auto"
          },
          seo: {
            title: {
              value: "Витрина: Полноэкранные Изображения",
              source: "auto"
            },
            description: {
              value: "Полноэкранные изображения с интерактивными заголовками и ссылками.",
              source: "auto"
            },
            keywords: {
              value: "витрина, полноэкранный, карусель, заголовки",
              source: "auto"
            }
          },
          captions: [],
          showcaseData: [
            {
              title: {
                value: "Проект: Уличные Зарисовки",
                source: "auto"
              },
              link: {
                label: {
                  value: "Смотреть Галерею",
                  source: "auto"
                }
              }
            },
            {
              title: {
                value: "Проект: Городские Пейзажи",
                source: "auto"
              },
              link: {
                label: {
                  value: "Узнать Больше",
                  source: "auto"
                }
              }
            },
            {
              title: {
                value: "История Мегаполиса",
                source: "auto"
              }
            },
            {
              title: {
                value: "Тихие Улицы",
                source: "auto"
              },
              link: {
                label: {
                  value: "Открыть",
                  source: "auto"
                }
              }
            },
            {
              title: {
                value: "Отражения",
                source: "auto"
              }
            },
            {
              title: {
                value: "Под Небом",
                source: "auto"
              }
            },
            {
              title: {
                value: "Эхо Прошлого",
                source: "auto"
              }
            },
            {
              title: {
                value: "Световые Диалоги",
                source: "auto"
              }
            },
            {
              title: {
                value: "Тени Города",
                source: "auto"
              }
            },
            {
              title: {
                value: "В Движении",
                source: "auto"
              }
            },
            {
              title: {
                value: "Моменты",
                source: "auto"
              }
            },
            {
              title: {
                value: "Ритмы Города",
                source: "auto"
              }
            },
            {
              title: {
                value: "Перекрестки",
                source: "auto"
              }
            }
          ]
        }
      },
      textPagesData: {
        bio: {
          title: {
            value: "Биография",
            source: "auto"
          },
          contentHtml: {
            value: "<h1>Заголовок H1</h1>\n<h2>Заголовок H2</h2>\n<h3>Заголовок H3</h3>\n<p><strong>Илья Пилипенко</strong> – фотограф и куратор, чьи работы исследуют взаимодействие человека с окружающей средой и трансформацию городских ландшафтов. Родился в 1985 году в Киеве, Илья рано проявил интерес к визуальным искусствам и фотографии как способу документирования и интерпретации реальности.</p>\n<p>Его ранние проекты были сосредоточены на заброшенных промышленных зонах и их скрытой красоте. Со временем его подход эволюционировал, включив более глубокое осмысление социальных динамик и повседневной жизни.</p>\n<p><strong>Маркированный Список:</strong></p>\n<ul>\n<li>Пункт списка один</li>\n<li>Пункт списка два</li>\n<li>Пункт списка три, который очень длинный и должен переноситься на несколько строк для проверки форматирования и интервала.</li>\n</ul>\n<p><strong>Нумерованный Список:</strong></p>\n<ol>\n<li>Первый пункт</li>\n<li>Второй пункт</li>\n<li>Третий пункт, также длинный для проверки.</li>\n</ol>\n<p>Илья является сооснователем и бывшим главным редактором проекта <a href=\"https://monogoroda.closeuprussia.com/en/\" target=\"_blank\" rel=\"noopener noreferrer\">«Невидимые Города»</a>, целью которого было документирование жизни малых и средних городов постсоветского пространства. Этот проект получил признание за уникальный взгляд на провинциальную Россию и ее жителей.</p>\n<p>Параллельно с фотографической практикой Илья активно занимается кураторской деятельностью. Он автор популярного Telegram-канала <a href=\"https://t.me/photoexperience\" target=\"_blank\" rel=\"noopener noreferrer\">«Опыт Фотографии»</a>, где делится аналитическими статьями, обзорами и советами по фотографии, а также курирует выставки молодых талантов.</p>\n<p>В 2022 году Илья стал сооснователем онлайн-галереи <a href=\"https://galleryf11.com/en/\" target=\"_blank\" rel=\"noopener noreferrer\">F11</a>, платформы для демонстрации и продажи работ современных фотографов.</p>\n<p>Работы Ильи Пилипенко выставлялись в различных галереях и музеях, а также публиковались в международных изданиях. Он продолжает свою творческую и исследовательскую деятельность, постоянно ища новые формы выражения и способы взаимодействия с аудиторией.</p>\n<p>По предложениям о сотрудничестве или вопросам о работах, пожалуйста, свяжитесь по электронной почте: <a href=\"mailto:ilpilipenko@gmail.com\">ilpilipenko@gmail.com</a></p>\n<p><img src=\"pictures/gallery1_images/02.jpg\" alt=\"Пример изображения в текстовом контенте\"></p>\n<p><img src=\"pictures/gallery1_images/06.jpg\" alt=\"Пример изображения в текстовом контенте\"></p>\n<p><video width=\"300\" height=\"150\" controls=\"controls\" src=\"pictures/text_content_images/example_text_video_1.mp4\" alt=\"Пример видео в текстовом контенте\"></video></p>\n<p>-- Новые примеры форматирования --</p>\n<blockquote>Это моя любимая цитата, которая вдохновляет меня каждый день. Она отлично смотрится в этом новом стиле.</blockquote>\n<p>Здесь я могу продемонстрировать две свои работы рядом.</p>\n[gallery:gallery2]\n<p>А вот так выглядит галерея из трех изображений.</p>\n[gallery:gallery6]\n<p>Наконец, здесь вы можете посмотреть одно из моих видео.</p>\n<div class=\"video-container\"><iframe width=\"560\" height=\"315\" title=\"Calamity Cat\" src=\"https://video.lono.space/videos/embed/tLJbQKHsVx5aUHBRz63pdu\" frameborder=\"0\" allowfullscreen=\"allowfullscreen\" sandbox=\"allow-same-origin allow-scripts allow-popups allow-forms\"></iframe></div>",
            source: "auto"
          },
          seo: {
            title: {
              value: "Биография Ильи Пилипенко",
              source: "auto"
            },
            description: {
              value: "Подробная биография и творческий путь документального фотографа Ильи Пилипенко.",
              source: "auto"
            },
            keywords: {
              value: "биография, фотограф, куратор, Илья Пилипенко",
              source: "auto"
            }
          }
        },
        my_text_page: {
          title: {
            value: "Дополнительная Текстовая Страница",
            source: "auto"
          },
          contentHtml: {
            value: "<p>Это <strong>дополнительная текстовая страница</strong>, которую можно использовать для размещения резюме, контактов, списка публикаций или любой другой информации.</p>\n<p>Как и в разделе «Биография», здесь можно использовать <em>HTML-теги</em> для форматирования текста, добавления <strong>ссылок</strong> и так далее.</p>\n<p>Экспериментируйте с контентом, чтобы максимально эффективно использовать этот функционал для вашего портфолио!</p>",
            source: "auto"
          },
          seo: {
            title: {
              value: "Дополнительная Информация",
              source: "auto"
            },
            description: {
              value: "Дополнительная текстовая страница для резюме, контактов или публикаций.",
              source: "auto"
            },
            keywords: {
              value: "контакты, резюме, публикации, информация",
              source: "auto"
            }
          }
        }
      }
    }
  },
  customCode: {
    customCSS: "",
    customJS: "\n console.log(\"Custom JavaScript loaded from config!\");\n "
  }
};
