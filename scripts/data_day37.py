# -*- coding: utf-8 -*-
"""Data definition for Day 37: Learning to Code."""

vocab_day37 = [
    {
        "headword": "source code",
        "pronunciation": "/sɔːrs koʊd/",
        "partOfSpeech": "noun",
        "definition": "The human-readable text of a computer program written in a programming language before compilation.",
        "example": "Developers read and write source code using an advanced integrated development environment.",
        "translation": "الكود المصدري / النص البرمجي الأصلي",
        "exampleArabic": "يقرأ المطورون ويكتبون الكود المصدري باستخدام بيئة تطوير متكاملة متقدمة.",
        "relatedForms": [],
        "collocations": ["open source code", "write source code", "inspect source code"],
        "synonyms": ["program code", "codebase"],
        "antonyms": ["compiled binary", "machine code"],
        "tags": ["coding", "fundamentals"]
    },
    {
        "headword": "programming language",
        "pronunciation": "/ˈproʊɡræmɪŋ ˈlæŋɡwɪdʒ/",
        "partOfSpeech": "noun",
        "definition": "A formal system of notation and grammar used for instructing a computer to perform specific computations.",
        "example": "Python is considered an ideal first programming language due to its readable syntax.",
        "translation": "لغة البرمجة",
        "exampleArabic": "تعتبر بايثون لغة برمجة أولى مثالية نظراً لبناء جملها البرمجية السهل المقروء.",
        "relatedForms": ["programming languages"],
        "collocations": ["learn a programming language", "typed programming language"],
        "synonyms": ["coding language"],
        "antonyms": ["natural language"],
        "tags": ["coding", "languages"]
    },
    {
        "headword": "algorithm",
        "pronunciation": "/ˈælɡərɪðəm/",
        "partOfSpeech": "noun",
        "definition": "A finite sequence of well-defined, computer-implementable instructions to solve a class of problems.",
        "example": "The search engine uses a sophisticated ranking algorithm to organize web results.",
        "translation": "الخوارزمية (خطوات الحل المنطقية)",
        "exampleArabic": "يستخدم محرك البحث خوارزمية ترتيب متطورة لتنظيم نتائج الويب.",
        "relatedForms": ["algorithmic", "algorithms"],
        "collocations": ["efficient algorithm", "sorting algorithm", "design an algorithm"],
        "synonyms": ["procedure", "computational method"],
        "antonyms": [],
        "tags": ["computer science", "logic"]
    },
    {
        "headword": "syntax",
        "pronunciation": "/ˈsɪntæks/",
        "partOfSpeech": "noun",
        "definition": "The set of rules that defines the combinations of symbols considered to be correctly structured programs in a language.",
        "example": "A single missing semicolon can cause a frustrating syntax error in JavaScript.",
        "translation": "بناء الجملة البرمجية / القواعد النحوية للغة البرمجة",
        "exampleArabic": "يمكن أن تتسبب فاصلة منقوطة مفقودة واحدة في خطأ نحوي برمجي محبط في لغة جافا سكريبت.",
        "relatedForms": ["syntactic"],
        "collocations": ["syntax error", "clean syntax", "language syntax"],
        "synonyms": ["grammar rules"],
        "antonyms": ["semantics"],
        "tags": ["coding", "fundamentals"]
    },
    {
        "headword": "data structure",
        "pronunciation": "/ˈdeɪtə ˈstrʌktʃər/",
        "partOfSpeech": "noun",
        "definition": "A specialized format for organizing, processing, retrieving, and storing data in computer memory.",
        "example": "Choosing the appropriate data structure dramatically reduces execution time.",
        "translation": "هيكل البيانات (طريقة تنظيم البيانات برمجياً)",
        "exampleArabic": "يؤدي اختيار هيكل البيانات المناسب إلى تقليل وقت التنفيذ بشكل كبير.",
        "relatedForms": ["data structures"],
        "collocations": ["common data structure", "tree data structure", "graph data structure"],
        "synonyms": ["data format", "data organization"],
        "antonyms": [],
        "tags": ["computer science"]
    },
    {
        "headword": "variable",
        "pronunciation": "/ˈveriəbəl/",
        "partOfSpeech": "noun",
        "definition": "A named storage location paired with an associated symbolic name that contains some known or unknown quantity of information.",
        "example": "Declare a variable to hold the user's shopping cart total.",
        "translation": "المتغير البرمجي",
        "exampleArabic": "أعلن عن متغير للاحتفاظ بإجمالي سلة تسوق المستخدم.",
        "relatedForms": ["variables"],
        "collocations": ["declare a variable", "assign a variable", "global variable"],
        "synonyms": ["identifier", "data holder"],
        "antonyms": ["constant"],
        "tags": ["coding", "variables"]
    },
    {
        "headword": "constant",
        "pronunciation": "/ˈkɑːnstənt/",
        "partOfSpeech": "noun",
        "definition": "An identifier whose associated value cannot be altered by the program during normal execution.",
        "example": "Define PI as a constant so its value never changes unexpectedly.",
        "translation": "الثابت البرمجي (قيمة لا تتغير)",
        "exampleArabic": "عرّف الثابت الرياضي باي (PI) كثابت حتى لا تتغير قيمته بشكل غير متوقع.",
        "relatedForms": ["constants"],
        "collocations": ["define a constant", "numeric constant"],
        "synonyms": ["immutable value"],
        "antonyms": ["variable"],
        "tags": ["coding", "variables"]
    },
    {
        "headword": "data type",
        "pronunciation": "/ˈdeɪtə taɪp/",
        "partOfSpeech": "noun",
        "definition": "An attribute of data which tells the compiler or interpreter how the programmer intends to use the data.",
        "example": "Strings, integers, and booleans are the foundational primitive data types.",
        "translation": "نوع البيانات (مثل نص، عدد، قيمة منطقية)",
        "exampleArabic": "تعد النصوص والأعداد الصحيحة والقيم المنطقية من أنواع البيانات الأولية التأسيسية.",
        "relatedForms": ["data types"],
        "collocations": ["primitive data type", "custom data type"],
        "synonyms": ["type"],
        "antonyms": [],
        "tags": ["coding", "fundamentals"]
    },
    {
        "headword": "boolean",
        "pronunciation": "/ˈbuːliən/",
        "partOfSpeech": "noun",
        "definition": "A binary data type that can hold only one of two possible values: true or false.",
        "example": "The function returns a boolean indicating whether the password meets security rules.",
        "translation": "قيمة منطقية (صح أو خطأ)",
        "exampleArabic": "تُرجع الدالة قيمة منطقية تشير إلى ما إذا كانت كلمة المرور تستوفي قواعد الأمان.",
        "relatedForms": ["booleans"],
        "collocations": ["boolean expression", "boolean value", "boolean flag"],
        "synonyms": ["logical value", "binary flag"],
        "antonyms": [],
        "tags": ["coding", "types"]
    },
    {
        "headword": "integer",
        "pronunciation": "/ˈɪntɪdʒər/",
        "partOfSpeech": "noun",
        "definition": "A whole number that can be positive, negative, or zero, without any fractional component.",
        "example": "Use an unsigned integer to represent the count of registered conference attendees.",
        "translation": "عدد صحيح (بدون كسور)",
        "exampleArabic": "استخدم عدداً صحيحاً غير موقع لتمثيل عدد الحاضرين المسجلين في المؤتمر.",
        "relatedForms": ["integers", "int"],
        "collocations": ["positive integer", "integer division", "parse an integer"],
        "synonyms": ["whole number"],
        "antonyms": ["floating-point number"],
        "tags": ["coding", "types"]
    },
    {
        "headword": "string manipulation",
        "pronunciation": "/strɪŋ məˌnɪpjuˈleɪʃən/",
        "partOfSpeech": "noun",
        "definition": "Operations performed on sequences of characters such as slicing, concatenating, or searching.",
        "example": "Regular expressions are an indispensable tool for advanced string manipulation.",
        "translation": "معالجة النصوص البرمجية (سلاسل الحروف)",
        "exampleArabic": "تعد التعبيرات النمطية أداة لا غنى عنها لمعالجة النصوص وسلاسل الحروف المتقدمة.",
        "relatedForms": [],
        "collocations": ["perform string manipulation", "string manipulation functions"],
        "synonyms": ["text processing"],
        "antonyms": [],
        "tags": ["coding", "operations"]
    },
    {
        "headword": "array",
        "pronunciation": "/əˈreɪ/",
        "partOfSpeech": "noun",
        "definition": "An ordered arrangement of elements of the same type stored at contiguous memory locations.",
        "example": "We stored the list of active server IP addresses inside a dynamic array.",
        "translation": "المصفوفة البرمجية (الأراي)",
        "exampleArabic": "قمنا بتخزين قائمة عناوين IP للخوادم النشطة داخل مصفوفة ديناميكية.",
        "relatedForms": ["arrays"],
        "collocations": ["array index", "iterate over an array", "multidimensional array"],
        "synonyms": ["list", "vector"],
        "antonyms": [],
        "tags": ["coding", "structures"]
    },
    {
        "headword": "function call",
        "pronunciation": "/ˈfʌŋkʃən kɔːl/",
        "partOfSpeech": "noun",
        "definition": "An expression that invokes and executes a function by passing arguments to its parameters.",
        "example": "A recursive function call must have an exit condition to avoid a stack overflow.",
        "translation": "استدعاء الدالة البرمجية",
        "exampleArabic": "يجب أن يحتوي استدعاء الدالة العودية على شرط خروج لتجنب فيضان مكدس الذاكرة.",
        "relatedForms": ["function calls"],
        "collocations": ["make a function call", "asynchronous function call"],
        "synonyms": ["routine invocation"],
        "antonyms": [],
        "tags": ["coding", "functions"]
    },
    {
        "headword": "parameter",
        "pronunciation": "/pəˈræmɪtər/",
        "partOfSpeech": "noun",
        "definition": "A variable in a function definition that receives a value when the function is called.",
        "example": "The authenticateUser function takes two parameters: username and password.",
        "translation": "معامل الدالة البرمجية (الباراميتر)",
        "exampleArabic": "تأخذ دالة مصادقة المستخدم معاملين: اسم المستخدم وكلمة المرور.",
        "relatedForms": ["parameters"],
        "collocations": ["function parameter", "optional parameter", "pass a parameter"],
        "synonyms": ["argument placeholder", "formal argument"],
        "antonyms": [],
        "tags": ["coding", "functions"]
    },
    {
        "headword": "return value",
        "pronunciation": "/rɪˈtɜːrn ˈvæljuː/",
        "partOfSpeech": "noun",
        "definition": "The value that a function outputs or delivers back to the calling code upon completing its work.",
        "example": "The return value of this sorting algorithm is an array organized in ascending order.",
        "translation": "القيمة المرجعة من الدالة",
        "exampleArabic": "القيمة المرجعة لخوارزمية الترتيب هذه هي مصفوفة مرتبة تصاعدياً.",
        "relatedForms": ["return values"],
        "collocations": ["check the return value", "expected return value"],
        "synonyms": ["output value", "result"],
        "antonyms": [],
        "tags": ["coding", "functions"]
    },
    {
        "headword": "conditional statement",
        "pronunciation": "/kənˈdɪʃənl ˈsteɪtmənt/",
        "partOfSpeech": "noun",
        "definition": "A programming construct that performs different actions depending on whether a boolean evaluates to true or false.",
        "example": "Use an if-else conditional statement to handle valid and invalid user input gracefully.",
        "translation": "الجملة الشرطية البرمجية (مثل if و else)",
        "exampleArabic": "استخدم جملة شرطية (if-else) للتعامل مع مدخلات المستخدم الصالحة وغير الصالحة بسلاسة.",
        "relatedForms": ["conditional statements"],
        "collocations": ["evaluate conditional statement", "nested conditional statement"],
        "synonyms": ["if statement", "branch"],
        "antonyms": [],
        "tags": ["logic", "control flow"]
    },
    {
        "headword": "loop",
        "pronunciation": "/luːp/",
        "partOfSpeech": "noun",
        "definition": "A sequence of instructions that is continually repeated until a certain condition is reached.",
        "example": "A for loop iterates through every element in the array to calculate the total sum.",
        "translation": "حلقة التكرار البرمجية (اللوب)",
        "exampleArabic": "تتكرر حلقة for عبر كل عنصر في المصفوفة لحساب المجموع الكلي.",
        "relatedForms": ["loops", "looped", "looping"],
        "collocations": ["infinite loop", "for loop", "while loop"],
        "synonyms": ["iteration construct", "cycle"],
        "antonyms": [],
        "tags": ["control flow", "logic"]
    },
    {
        "headword": "iteration",
        "pronunciation": "/ˌɪtəˈreɪʃən/",
        "partOfSpeech": "noun",
        "definition": "A single execution of the set of instructions inside a repetitive loop.",
        "example": "During each iteration of the loop, the counter variable increments by one.",
        "translation": "دورة تكرارية واحدة في الحلقة البرمجية",
        "exampleArabic": "أثناء كل دورة تكرارية للحلقة، تزداد قيمة متغير العداد بمقدار واحد.",
        "relatedForms": ["iterate", "iterative"],
        "collocations": ["current iteration", "loop iteration"],
        "synonyms": ["cycle", "pass", "repetition"],
        "antonyms": [],
        "tags": ["control flow", "logic"]
    },
    {
        "headword": "recursion",
        "pronunciation": "/rɪˈkɜːrʒən/",
        "partOfSpeech": "noun",
        "definition": "A programming method where a function calls itself directly or indirectly to solve sub-problems.",
        "example": "Tree traversal algorithms are expressed most elegantly using mathematical recursion.",
        "translation": "العودية البرمجية (استدعاء الدالة لنفسها)",
        "exampleArabic": "يتم التعبير عن خوارزميات اجتياز الشجرة بأقصى درجات الأناقة باستخدام العودية الرياضية.",
        "relatedForms": ["recursive", "recursively"],
        "collocations": ["base case in recursion", "infinite recursion"],
        "synonyms": ["self-reference"],
        "antonyms": ["iteration"],
        "tags": ["algorithms", "computer science"]
    },
    {
        "headword": "nested condition",
        "pronunciation": "/ˈnestɪd kənˈdɪʃən/",
        "partOfSpeech": "noun",
        "definition": "A condition placed inside another conditional statement to evaluate secondary rules.",
        "example": "Too many nested conditions make code difficult to read and test thoroughly.",
        "translation": "شرط برمجي متداخل",
        "exampleArabic": "تجعل كثرة الشروط المتداخلة الكود صعب القراءة والاختبار بدقة.",
        "relatedForms": ["nested conditions"],
        "collocations": ["avoid nested conditions", "deep nested condition"],
        "synonyms": ["nested if"],
        "antonyms": ["flat logic"],
        "tags": ["logic", "clean code"]
    },
    {
        "headword": "object-oriented",
        "pronunciation": "/ˈɑːbdʒɪkt ˈɔːrientɪd/",
        "partOfSpeech": "adjective",
        "definition": "A programming paradigm based on the concept of objects which contain data and methods.",
        "example": "Java and C# are widely recognized as classic object-oriented programming languages.",
        "translation": "كائني التوجه / البرمجة كائنية التوجه (OOP)",
        "exampleArabic": "تعتبر جافا وسي شارب من لغات البرمجة كائنية التوجه الكلاسيكية المعترف بها على نطاق واسع.",
        "relatedForms": ["OOP"],
        "collocations": ["object-oriented programming", "object-oriented design"],
        "synonyms": ["OOP-based"],
        "antonyms": ["functional", "procedural"],
        "tags": ["paradigms", "OOP"]
    },
    {
        "headword": "class definition",
        "pronunciation": "/klæs ˌdefɪˈnɪʃən/",
        "partOfSpeech": "noun",
        "definition": "A blueprint or template that specifies the attributes and behaviors common to all objects of that type.",
        "example": "The class definition for User encapsulates password hashing and validation logic.",
        "translation": "تعريف الفئة البرمجية (الكلاس)",
        "exampleArabic": "يتضمن تعريف الفئة للمستخدم منطق تشفير كلمة المرور والتحقق من صحتها.",
        "relatedForms": ["class definitions"],
        "collocations": ["write a class definition", "abstract class definition"],
        "synonyms": ["blueprint", "class declaration"],
        "antonyms": [],
        "tags": ["OOP", "design"]
    },
    {
        "headword": "object instance",
        "pronunciation": "/ˈɑːbdʒɪkt ˈɪnstəns/",
        "partOfSpeech": "noun",
        "definition": "A concrete occurrence or realization of any object existing in computer memory created from a class.",
        "example": "When a new player logs into the game, the server creates a player object instance.",
        "translation": "نسخة كائن ملموسة في الذاكرة (إنستانس)",
        "exampleArabic": "عندما يسجل لاعب جديد دخوله إلى اللعبة، ينشئ الخادم نسخة كائن للاعب في الذاكرة.",
        "relatedForms": ["object instances", "instantiate"],
        "collocations": ["instantiate an object instance", "unique object instance"],
        "synonyms": ["instance"],
        "antonyms": ["class blueprint"],
        "tags": ["OOP"]
    },
    {
        "headword": "inheritance",
        "pronunciation": "/ɪnˈherɪtəns/",
        "partOfSpeech": "noun",
        "definition": "The mechanism of basing an object or class upon another object or class, retaining similar implementation.",
        "example": "Class inheritance enables the Developer class to inherit all properties of Employee.",
        "translation": "الوراثة في البرمجة كائنية التوجه",
        "exampleArabic": "تتيح وراثة الفئات لفئة المطور وراثة جميع خصائص فئة الموظف.",
        "relatedForms": ["inherit", "inherited"],
        "collocations": ["single inheritance", "multiple inheritance", "class inheritance"],
        "synonyms": ["derivation"],
        "antonyms": [],
        "tags": ["OOP"]
    },
    {
        "headword": "polymorphism",
        "pronunciation": "/ˌpɑːliˈmɔːrfɪzəm/",
        "partOfSpeech": "noun",
        "definition": "The provision of a single interface to entities of different types or methods that override common behavior.",
        "example": "Through polymorphism, each shape object calculates its area using its own custom method.",
        "translation": "تعدد الأشكال البرمجي (البوليمورفزم)",
        "exampleArabic": "من خلال تعدد الأشكال، يحسب كل كائن شكل هندسي مساحته باستخدام طريقته المخصصة.",
        "relatedForms": ["polymorphic"],
        "collocations": ["exhibit polymorphism", "runtime polymorphism"],
        "synonyms": ["method overriding"],
        "antonyms": [],
        "tags": ["OOP"]
    },
    {
        "headword": "encapsulation",
        "pronunciation": "/ɪnˌkæpsjʊˈleɪʃən/",
        "partOfSpeech": "noun",
        "definition": "The bundling of data with the methods that operate on that data, restricting direct access to inner components.",
        "example": "Encapsulation prevents external modules from modifying private internal database states directly.",
        "translation": "الكبسلة وتغليف البيانات (منع التعديل المباشر)",
        "exampleArabic": "تمنع الكبسلة الوحدات الخارجية من تعديل حالات قاعدة البيانات الداخلية الخاصة مباشرة.",
        "relatedForms": ["encapsulate"],
        "collocations": ["data encapsulation", "principle of encapsulation"],
        "synonyms": ["information hiding"],
        "antonyms": ["open exposure"],
        "tags": ["OOP", "design"]
    },
    {
        "headword": "abstraction",
        "pronunciation": "/æbˈstrækʃən/",
        "partOfSpeech": "noun",
        "definition": "The practice of hiding complex implementation details and showing only the essential features of an object.",
        "example": "Good abstraction hides hardware intricacies behind clean, expressive application interfaces.",
        "translation": "التجريد البرمجي (إخفاء التعقيد وإبراز المفيد)",
        "exampleArabic": "يخفي التجريد الجيد تعقيدات العتاد وراء واجهات برمجية تطبيقية نظيفة ومعبرة.",
        "relatedForms": ["abstract"],
        "collocations": ["level of abstraction", "create an abstraction"],
        "synonyms": ["simplification", "conceptual model"],
        "antonyms": ["concreteness"],
        "tags": ["OOP", "architecture"]
    },
    {
        "headword": "design pattern",
        "pronunciation": "/dɪˈzaɪn ˈpætərn/",
        "partOfSpeech": "noun",
        "definition": "A reusable general solution to a commonly occurring problem in software engineering.",
        "example": "The Singleton is a well-known design pattern that restricts a class to one single instance.",
        "translation": "نمط التصميم البرمجي",
        "exampleArabic": "يعد نمط المفرد (Singleton) نمط تصميم معروف يقيد الفئة بإنشاء نسخة واحدة فقط.",
        "relatedForms": ["design patterns"],
        "collocations": ["software design pattern", "apply a design pattern"],
        "synonyms": ["architectural pattern"],
        "antonyms": ["anti-pattern"],
        "tags": ["architecture", "engineering"]
    },
    {
        "headword": "software architecture",
        "pronunciation": "/ˈsɔːftwer ˈɑːrkɪtektʃər/",
        "partOfSpeech": "noun",
        "definition": "The fundamental structures of a software system and the discipline of creating such structures.",
        "example": "Microservices have become a dominant software architecture for scalable cloud web applications.",
        "translation": "معمارية وهندسة البرمجيات",
        "exampleArabic": "أصبحت الخدمات المصغرة معمارية برمجيات مهيمنة لتطبيقات الويب السحابية القابلة للتوسع.",
        "relatedForms": ["architect"],
        "collocations": ["scalable software architecture", "modern software architecture"],
        "synonyms": ["system architecture", "high-level design"],
        "antonyms": [],
        "tags": ["architecture"]
    },
    {
        "headword": "modularity",
        "pronunciation": "/ˌmɑːdʒəˈlærəti/",
        "partOfSpeech": "noun",
        "definition": "The degree to which a system's components may be separated and recombined independently.",
        "example": "High modularity ensures that changing the billing service will not break user authentication.",
        "translation": "النمطية وقابلية تقسيم النظام إلى وحدات مستقلة",
        "exampleArabic": "تضمن النمطية العالية أن تغيير خدمة الفوترة لن يعطل مصادقة المستخدمين.",
        "relatedForms": ["modular"],
        "collocations": ["system modularity", "promote modularity"],
        "synonyms": ["decoupling", "separation of concerns"],
        "antonyms": ["monolithic design"],
        "tags": ["architecture", "clean code"]
    },
    {
        "headword": "code editor",
        "pronunciation": "/koʊd ˈedɪtər/",
        "partOfSpeech": "noun",
        "definition": "A text editor program designed specifically for editing source code of computer programs.",
        "example": "VS Code is an extremely popular lightweight code editor equipped with rich plugin support.",
        "translation": "محرر الكود البرمجي",
        "exampleArabic": "برنامج VS Code هو محرر كود خفيف وشعبي للغاية ومزود بدعم غني للإضافات.",
        "relatedForms": ["code editors"],
        "collocations": ["lightweight code editor", "open in code editor"],
        "synonyms": ["programmer editor"],
        "antonyms": [],
        "tags": ["tools", "development"]
    },
    {
        "headword": "integrated development environment",
        "pronunciation": "/ˈɪntɪɡreɪtɪd dɪˈveləpmənt ɪnˈvaɪrənmənt/",
        "partOfSpeech": "noun",
        "definition": "A software suite that consolidates basic tools required to write and test software into one GUI.",
        "example": "IntelliJ IDEA is an integrated development environment providing advanced refactoring tools.",
        "translation": "بيئة التطوير المتكاملة (IDE)",
        "exampleArabic": "برنامج IntelliJ IDEA هو بيئة تطوير متكاملة توفر أدوات متقدمة لإعادة هيكلة الكود.",
        "relatedForms": ["IDE"],
        "collocations": ["full-featured integrated development environment", "modern IDE"],
        "synonyms": ["IDE"],
        "antonyms": ["plain text editor"],
        "tags": ["tools", "development"]
    },
    {
        "headword": "compiler",
        "pronunciation": "/kəmˈpaɪlər/",
        "partOfSpeech": "noun",
        "definition": "A program that translates source code written in a high-level language into machine code or bytecode.",
        "example": "The Rust compiler is famous for producing highly optimized and memory-safe binaries.",
        "translation": "المترجم البرمجي (الكومبايلر)",
        "exampleArabic": "يشتهر مترجم لغة ريست (Rust) بإنتاج ملفات ثنائية محسنة للغاية وآمنة في الذاكرة.",
        "relatedForms": ["compile", "compilation"],
        "collocations": ["compiler warning", "run the compiler", "optimizing compiler"],
        "synonyms": ["translator"],
        "antonyms": ["interpreter"],
        "tags": ["tools", "compilation"]
    },
    {
        "headword": "interpreter",
        "pronunciation": "/ɪnˈtɜːrprətər/",
        "partOfSpeech": "noun",
        "definition": "A computer program that directly executes instructions written in a programming language line by line.",
        "example": "The Python interpreter parses your script line by line without prior compilation to binary.",
        "translation": "المفسر البرمجي (الإنتربريتر)",
        "exampleArabic": "يحلل مفسر بايثون النص البرمجي سطراً بسطر دون ترجمة مسبقة إلى ملف ثنائي.",
        "relatedForms": ["interpret"],
        "collocations": ["command interpreter", "Python interpreter"],
        "synonyms": ["runtime executor"],
        "antonyms": ["compiler"],
        "tags": ["tools", "execution"]
    },
    {
        "headword": "terminal emulator",
        "pronunciation": "/ˈtɜːrmɪnl ˈemjuleɪtər/",
        "partOfSpeech": "noun",
        "definition": "A program that replicates the functionality of a classic computer terminal within a graphical window.",
        "example": "Developers spend hours executing shell commands inside their favorite terminal emulator.",
        "translation": "محاكي الطرفية (السطر البرمجي / التيرمينال)",
        "exampleArabic": "يقضي المطورون ساعات في تنفيذ أوامر الصدفة داخل محاكي الطرفية المفضل لديهم.",
        "relatedForms": ["terminal emulators"],
        "collocations": ["launch terminal emulator", "custom terminal emulator"],
        "synonyms": ["terminal", "command prompt window"],
        "antonyms": [],
        "tags": ["tools", "terminal"]
    },
    {
        "headword": "version control",
        "pronunciation": "/ˈvɜːrʒən kənˈtroʊl/",
        "partOfSpeech": "noun",
        "definition": "The practice of tracking and managing changes to software code over its lifecycle.",
        "example": "Using version control enables multiple programmers to work on the same file without conflict.",
        "translation": "التحكم في الإصدارات وإدارة التغييرات (مثل جيت)",
        "exampleArabic": "يتيح استخدام نظام التحكم في الإصدارات لعدة مبرمجين العمل على نفس الملف دون تعارض.",
        "relatedForms": ["VCS"],
        "collocations": ["version control system", "Git version control"],
        "synonyms": ["source control", "revision control"],
        "antonyms": [],
        "tags": ["git", "workflow"]
    },
    {
        "headword": "git repository",
        "pronunciation": "/ɡɪt rɪˈpɑːzətɔːri/",
        "partOfSpeech": "noun",
        "definition": "A data structure that stores the complete history of files, branches, and commits for a software project.",
        "example": "Clone the remote Git repository to your local computer before opening the code editor.",
        "translation": "مستودع جيت البرمجي (الريبو)",
        "exampleArabic": "انسخ مستودع جيت البعيد إلى حاسوبك المحلي قبل فتح محرر الكود.",
        "relatedForms": ["git repositories", "repo"],
        "collocations": ["clone a Git repository", "remote Git repository"],
        "synonyms": ["repo", "code repository"],
        "antonyms": [],
        "tags": ["git", "tools"]
    },
    {
        "headword": "commit changes",
        "pronunciation": "/kəˈmɪt ˈtʃeɪndʒɪz/",
        "partOfSpeech": "phrase",
        "definition": "To save a snapshot of modified files permanently into a version control history log.",
        "example": "Always write a descriptive message whenever you commit changes to the branch.",
        "translation": "يعتمد التغييرات في سجل جيت (كوميت)",
        "exampleArabic": "اكتب دائماً رسالة وصفية واضحة كلما اعتمدت تغييرات في الفرع.",
        "relatedForms": ["committed changes", "committing changes"],
        "collocations": ["commit changes with a message", "stage and commit changes"],
        "synonyms": ["save revision", "record snapshot"],
        "antonyms": ["discard changes"],
        "tags": ["git", "actions"]
    },
    {
        "headword": "branching",
        "pronunciation": "/ˈbræntʃɪŋ/",
        "partOfSpeech": "noun",
        "definition": "The duplication of an object under version control so that modifications can happen in parallel.",
        "example": "Feature branching keeps experimental code isolated from the stable production codebase.",
        "translation": "التفريع البرمجي (إنشاء فروع مستقلة للعمل)",
        "exampleArabic": "يحافظ التفريع البرمجي للميزات على عزل الكود التجريبي عن قاعدة الكود المستقرة في الإنتاج.",
        "relatedForms": ["branch", "branches"],
        "collocations": ["Git branching strategy", "feature branching"],
        "synonyms": ["forking", "divergence"],
        "antonyms": ["merging"],
        "tags": ["git", "workflow"]
    },
    {
        "headword": "pull request",
        "pronunciation": "/pʊl rɪˈkwest/",
        "partOfSpeech": "noun",
        "definition": "A method of submitting contributions to a software project, notifying authors to review changes before merging.",
        "example": "Submit a pull request once all automated unit tests pass successfully.",
        "translation": "طلب سحب ودمج الكود (Pull Request / PR)",
        "exampleArabic": "أرسل طلب سحب ودمج بمجرد اجتياز جميع اختبارات الوحدة الآلية بنجاح.",
        "relatedForms": ["pull requests", "PR"],
        "collocations": ["open a pull request", "merge a pull request", "review a pull request"],
        "synonyms": ["merge request", "PR"],
        "antonyms": [],
        "tags": ["git", "collaboration"]
    },
    {
        "headword": "code review",
        "pronunciation": "/koʊd rɪˈvjuː/",
        "partOfSpeech": "noun",
        "definition": "A systematic examination of computer source code intended to find bugs and improve code quality.",
        "example": "Participating in peer code review teaches junior developers industry best practices.",
        "translation": "مراجعة الكود البرمجي وتدقيقه",
        "exampleArabic": "تعلّم المشاركة في مراجعة كود الأقران المطورين المبتدئين أفضل ممارسات الصناعة.",
        "relatedForms": ["code reviews"],
        "collocations": ["conduct a code review", "thorough code review"],
        "synonyms": ["peer review of code"],
        "antonyms": [],
        "tags": ["quality", "collaboration"]
    },
    {
        "headword": "continuous integration",
        "pronunciation": "/kənˈtɪnjuəs ˌɪntɪˈɡreɪʃən/",
        "partOfSpeech": "noun",
        "definition": "The software practice of automating the integration of code changes from multiple contributors into a single project.",
        "example": "Our continuous integration server builds the application and runs tests on every commit.",
        "translation": "التكامل المستمر (CI)",
        "exampleArabic": "يبني خادم التكامل المستمر لدينا التطبيق ويجري الاختبارات عند كل اعتماد للكود.",
        "relatedForms": ["CI"],
        "collocations": ["continuous integration pipeline", "continuous integration server"],
        "synonyms": ["CI"],
        "antonyms": ["manual deployment"],
        "tags": ["devops", "automation"]
    },
    {
        "headword": "package manager",
        "pronunciation": "/ˈpækɪdʒ ˈmænɪdʒər/",
        "partOfSpeech": "noun",
        "definition": "A system tool that automates installing, upgrading, configuring, and removing software libraries.",
        "example": "NPM is the default package manager used by millions of JavaScript developers.",
        "translation": "مدير الحزم البرمجية (مثل npm أو pip)",
        "exampleArabic": "مدير الحزم NPM هو المدير الافتراضي المستخدم من قبل ملايين مطوري جافا سكريبت.",
        "relatedForms": ["package managers"],
        "collocations": ["install via package manager", "popular package manager"],
        "synonyms": ["dependency manager"],
        "antonyms": [],
        "tags": ["tools", "dependencies"]
    },
    {
        "headword": "software library",
        "pronunciation": "/ˈsɔːftwer ˈlaɪbreri/",
        "partOfSpeech": "noun",
        "definition": "A collection of non-volatile resources and functions used by computer programs to avoid reinventing the wheel.",
        "example": "We imported an open-source cryptography software library to handle password hashing.",
        "translation": "المكتبة البرمجية",
        "exampleArabic": "استوردنا مكتبة برمجية مفتوحة المصدر للتشفير للتعامل مع تجزئة كلمات المرور.",
        "relatedForms": ["software libraries"],
        "collocations": ["import a software library", "open-source software library"],
        "synonyms": ["code library", "library"],
        "antonyms": [],
        "tags": ["development", "tools"]
    },
    {
        "headword": "framework",
        "pronunciation": "/ˈfreɪmwɜːrk/",
        "partOfSpeech": "noun",
        "definition": "A comprehensive software platform providing generic functionality that can be selectively overridden by users.",
        "example": "Next.js is a React-based web framework that supports server-side rendering out of the box.",
        "translation": "إطار العمل البرمجي (فريم وورك)",
        "exampleArabic": "برنامج Next.js هو إطار عمل ويب قائم على React يدعم التصيير من جانب الخادم تلقائياً.",
        "relatedForms": ["frameworks"],
        "collocations": ["web framework", "backend framework", "adopt a framework"],
        "synonyms": ["software scaffold", "application platform"],
        "antonyms": [],
        "tags": ["development", "architecture"]
    },
    {
        "headword": "refactoring",
        "pronunciation": "/ˌriːˈfæktərɪŋ/",
        "partOfSpeech": "noun",
        "definition": "The process of restructuring existing computer code without changing its external behavior.",
        "example": "Regular refactoring eliminates technical debt and keeps the software architecture maintainable.",
        "translation": "إعادة هيكلة وتحسين الكود (ريفاكتورينج)",
        "exampleArabic": "تقضي إعادة الهيكلة المنتظمة على الديون الفنية وتحافظ على قابلية صيانة معمارية البرمجيات.",
        "relatedForms": ["refactor"],
        "collocations": ["code refactoring", "undertake refactoring"],
        "synonyms": ["code cleanup", "restructuring"],
        "antonyms": ["rewriting from scratch"],
        "tags": ["clean code", "quality"]
    },
    {
        "headword": "clean code",
        "pronunciation": "/kliːn koʊd/",
        "partOfSpeech": "noun",
        "definition": "Source code that is simple, elegant, direct, well-formatted, and easy for other developers to read and maintain.",
        "example": "Writing clean code takes deliberate discipline but saves hundreds of hours during debugging.",
        "translation": "الكود النظيف والأنيق",
        "exampleArabic": "تتطلب كتابة الكود النظيف انضباطاً متعمداً لكنها توفر مئات الساعات أثناء تصحيح الأخطاء.",
        "relatedForms": [],
        "collocations": ["principles of clean code", "write clean code"],
        "synonyms": ["readable code", "elegant code"],
        "antonyms": ["spaghetti code"],
        "tags": ["clean code", "practices"]
    },
    {
        "headword": "documentation comment",
        "pronunciation": "/ˌdɑːkjumenˈteɪʃən ˈkɑːment/",
        "partOfSpeech": "noun",
        "definition": "A formatted comment embedded in source code used by generators to produce API references.",
        "example": "Add a clear documentation comment above each public method to explain parameters.",
        "translation": "تعليق التوثيق البرمجي (دوكيومنتيشن كومنت)",
        "exampleArabic": "أضف تعليق توثيق واضحاً فوق كل دالة عامة لشرح المعاملات.",
        "relatedForms": ["documentation comments"],
        "collocations": ["write a documentation comment", "standard documentation comment"],
        "synonyms": ["docstring"],
        "antonyms": [],
        "tags": ["clean code", "documentation"]
    },
    {
        "headword": "coding standard",
        "pronunciation": "/ˈkoʊdɪŋ ˈstændərd/",
        "partOfSpeech": "noun",
        "definition": "A set of guidelines for a specific programming language that recommends programming style, practices, and methods.",
        "example": "Our team enforces an automated linter to guarantee uniform adherence to our coding standard.",
        "translation": "المعيار القياسي لكتابة الكود (ستايل جايد)",
        "exampleArabic": "يفرض فريقنا أداة تدقيق آلي لضمان الالتزام الموحد بمعيار كتابة الكود لدينا.",
        "relatedForms": ["coding standards"],
        "collocations": ["enforce a coding standard", "team coding standard"],
        "synonyms": ["style guide"],
        "antonyms": [],
        "tags": ["practices", "standards"]
    },
    {
        "headword": "pair programming",
        "pronunciation": "/per ˈproʊɡræmɪŋ/",
        "partOfSpeech": "noun",
        "definition": "An agile software development technique in which two programmers work together at one workstation.",
        "example": "Engaging in pair programming helped our junior developer master complex asynchronous patterns.",
        "translation": "البرمجة الزوجية (مطوران يعملان معاً)",
        "exampleArabic": "ساعدت المشاركة في البرمجة الزوجية مطورنا المبتدئ على إتقان الأنماط غير المتزامنة المعقدة.",
        "relatedForms": [],
        "collocations": ["practice pair programming", "pair programming session"],
        "synonyms": ["collaborative coding"],
        "antonyms": ["solo coding"],
        "tags": ["practices", "collaboration"]
    }
]

grammar_day37 = [
    {
        "title": "Gerunds (verb + -ing)",
        "explanation": "A gerund is the -ing form of a verb that functions as a noun in a sentence. Gerunds can act as the subject of a clause ('Writing clean code requires discipline'), the object of specific verbs like enjoy, avoid, practice, keep ('She enjoys learning new programming languages'), or as the object of prepositions ('Before committing changes, review your diff').",
        "explanationArabic": "اسم الفعل (Gerund) هو صيغة الفعل المنتهية بـ -ing والتي تعمل كاسم في الجملة. ويمكن أن تأتي كفاعل للجملة ('كتابة الكود النظيف تتطلب انضباطاً'), أو كمفعول به لأفعال معينة مثل enjoy و avoid و practice و keep ('إنها تستمتع بتعلم لغات برمجة جديدة'), أو بعد حروف الجر ('قبل اعتماد التغييرات، راجع الفروقات').",
        "rules": [
            "Use gerund as the grammatical subject of a sentence to name an activity.",
            "Use gerund after common verbs: avoid, consider, enjoy, finish, practice, suggest, keep.",
            "Always use a gerund after a preposition (by, before, after, without, in, for).",
            "Negative gerund: not + verb-ing ('He apologized for not adding a documentation comment')."
        ],
        "rulesArabic": [
            "استخدم اسم الفعل (Gerund) كفاعل للجملة لتسمية نشاط ما.",
            "استخدمه بعد أفعال شائعة مثل: avoid, consider, enjoy, finish, practice, suggest, keep.",
            "استخدم اسم الفعل دائماً بعد حروف الجر (by, before, after, without, in, for).",
            "صيغة النفي لاسم الفعل: not + verb-ing ('اعتذر عن عدم إضافة تعليق التوثيق')."
        ],
        "structures": [
            {
                "pattern": "Verb-ing + complement + singular verb",
                "explanation": "Gerund as subject of the sentence.",
                "explanationArabic": "اسم الفعل كفاعل للجملة (يعامل معاملة المفرد)."
            },
            {
                "pattern": "Subject + verb (enjoy/avoid/practice) + Verb-ing",
                "explanation": "Gerund as direct object of specific verbs.",
                "explanationArabic": "اسم الفعل كمفعول به مباشر لأفعال معينة."
            },
            {
                "pattern": "Preposition (by/before/after) + Verb-ing",
                "explanation": "Gerund following a preposition.",
                "explanationArabic": "اسم الفعل بعد حرف الجر."
            }
        ],
        "examples": [
            {
                "sentence": "Learning a new programming language broadens your technical perspective.",
                "translation": "تعلم لغة برمجة جديدة يوسع أفقك التقني.",
                "usesVocabulary": ["programming language"]
            },
            {
                "sentence": "Before committing changes to the git repository, senior engineers recommend running tests.",
                "translation": "قبل اعتماد التغييرات في مستودع جيت، يوصي كبار المهندسين بإجراء الاختبارات.",
                "usesVocabulary": ["commit changes", "git repository"]
            },
            {
                "sentence": "Developers avoid writing nested conditions by practicing refactoring regularly.",
                "translation": "يتجنب المطورون كتابة الشروط المتداخلة من خلال ممارسة إعادة هيكلة الكود بانتظام.",
                "usesVocabulary": ["nested condition", "refactoring"]
            },
            {
                "sentence": "Writing clean code makes conducting a code review much faster for everyone.",
                "translation": "كتابة الكود النظيف تجعل إجراء مراجعة الكود أسرع بكثير للجميع.",
                "usesVocabulary": ["clean code", "code review"]
            }
        ],
        "commonMistakes": [
            {
                "wrong": "He improved by to practice pair programming.",
                "right": "He improved by practicing pair programming.",
                "note": "Always use a gerund (verb + -ing) directly after prepositions like 'by', 'before', 'after'.",
                "noteArabic": "استخدم دائماً اسم الفعل (verb + -ing) بعد حروف الجر مثل 'by' و 'before' و 'after'."
            },
            {
                "wrong": "Learn coding is exciting and rewarding.",
                "right": "Learning coding is exciting and rewarding.",
                "note": "Use the gerund ('Learning') as the subject of the sentence, not the bare verb.",
                "noteArabic": "استخدم اسم الفعل ('Learning') كفاعل للجملة وليس الفعل المجرد."
            }
        ]
    }
]

convs_day37 = [
    {
        "title": "Programming Fundamentals and Data Types",
        "titleArabic": "أساسيات البرمجة وأنواع البيانات",
        "setting": "Computer science mentoring lab",
        "settingArabic": "مختبر إرشاد علوم الحاسوب",
        "roles": ["Senior Engineer", "Apprentice Developer"],
        "vocabularyUsed": ["source code", "programming language", "algorithm", "syntax", "data structure", "variable", "constant", "data type", "boolean", "integer", "string manipulation", "array", "function call", "parameter", "return value"],
        "lines": [
            {
                "speaker": "Senior Engineer",
                "text": "Welcome to your first software lab! Today we will examine how clean source code is structured.",
                "translation": "مرحباً بك في أول مختبر برمجي لك! اليوم سنفحص كيفية تنظيم الكود المصدري النظيف."
            },
            {
                "speaker": "Apprentice Developer",
                "text": "I noticed every programming language has its own strict syntax rules.",
                "translation": "لاحظت أن كل لغة برمجة لها قواعد نحوية وبنائية صارمة خاصة بها."
            },
            {
                "speaker": "Senior Engineer",
                "text": "Exactly. To design an efficient algorithm, you must pick the ideal data structure.",
                "translation": "بالضبط. لتصميم خوارزمية فعالة، يجب عليك اختيار هيكل البيانات المثالي."
            },
            {
                "speaker": "Apprentice Developer",
                "text": "When declaring a variable, how do I know whether it should be a constant?",
                "translation": "عند الإعلان عن متغير، كيف أعرف ما إذا كان ينبغي أن يكون ثابتاً؟"
            },
            {
                "speaker": "Senior Engineer",
                "text": "If its value never changes, define it as a constant. Each identifier has a specific primitive data type.",
                "translation": "إذا كانت قيمته لا تتغير أبداً، فقم بتعريفه كثابت. وكل معرف له نوع بيانات أولي محدد."
            },
            {
                "speaker": "Apprentice Developer",
                "text": "So an integer stores whole numbers, while a boolean stores true or false flags?",
                "translation": "إذن يخزن العدد الصحيح أرقاماً كاملة، بينما تخزن القيمة المنطقية إشارات صح أو خطأ؟"
            },
            {
                "speaker": "Senior Engineer",
                "text": "Precisely. We also perform string manipulation on text and organize lists inside a dynamic array.",
                "translation": "تماماً. نقوم أيضاً بمعالجة النصوص على سلاسل الحروف وننظم القوائم داخل مصفوفة ديناميكية."
            },
            {
                "speaker": "Apprentice Developer",
                "text": "And when I make a function call, I pass arguments into each parameter to calculate a return value?",
                "translation": "وعندما أجري استدعاءً للدالة، أقوم بتمرير الوسائط في كل معامل لحساب قيمة مرجعة؟"
            },
            {
                "speaker": "Senior Engineer",
                "text": "Mastering those fundamentals is the secret to building resilient web platforms.",
                "translation": "إتقان هذه الأساسيات هو السر وراء بناء منصات ويب مرنة وقوية."
            }
        ]
    },
    {
        "title": "Control Flow and Object-Oriented Design",
        "titleArabic": "مسار التحكم والتصميم كائني التوجه",
        "setting": "Engineering whiteboard room",
        "settingArabic": "غرفة السبورة البيضاء الهندسية",
        "roles": ["Tech Lead", "Software Developer"],
        "vocabularyUsed": ["conditional statement", "loop", "iteration", "recursion", "nested condition", "object-oriented", "class definition", "object instance", "inheritance", "polymorphism", "encapsulation", "abstraction", "design pattern", "software architecture", "modularity"],
        "lines": [
            {
                "speaker": "Tech Lead",
                "text": "Let's review our backend design. We should avoid deep nested conditions inside that checkout logic.",
                "translation": "دعنا نراجع تصميم الواجهة الخلفية لدينا. يجب أن نتجنب الشروط المتداخلة العميقة داخل منطق الدفع ذلك."
            },
            {
                "speaker": "Software Developer",
                "text": "I replaced the multi-level conditional statement with a clean loop that processes each payment record.",
                "translation": "استبدلت الجملة الشرطية متعددة المستويات بحلقة تكرار نظيفة تعالج كل سجل دفع."
            },
            {
                "speaker": "Tech Lead",
                "text": "Make sure each iteration handles exceptions gracefully, or consider using recursion for hierarchical order trees.",
                "translation": "تأكد من أن كل دورة تكرارية تتعامل مع الاستثناءات بسلاسة، أو فكر في استخدام العودية لأشجار الطلبات الهرمية."
            },
            {
                "speaker": "Software Developer",
                "text": "Our codebase follows classic object-oriented principles. Here is the base class definition.",
                "translation": "تتبع قاعدة الكود لدينا المبادئ الكائنية التوجه الكلاسيكية. ها هو تعريف الفئة الأساسية."
            },
            {
                "speaker": "Tech Lead",
                "text": "When the service spins up, it allocates a dedicated object instance in cache memory.",
                "translation": "عندما تبدأ الخدمة في العمل، تخصص نسخة كائن مخصصة في ذاكرة التخزين المؤقت."
            },
            {
                "speaker": "Software Developer",
                "text": "We utilized inheritance so subclasses inherit shared fields, and polymorphism lets each model compute its own tax.",
                "translation": "استخدمنا الوراثة بحيث ترث الفئات الفرعية الحقول المشتركة، ويتيح تعدد الأشكال لكل نموذج حساب ضريبته الخاصة."
            },
            {
                "speaker": "Tech Lead",
                "text": "Solid application of encapsulation and abstraction hides complex SQL drivers behind clear repository interfaces.",
                "translation": "التطبيق القوي للكبسلة والتجريد يخفي برامج تشغيل SQL المعقدة وراء واجهات مستودعات واضحة."
            },
            {
                "speaker": "Software Developer",
                "text": "Adopting the Factory design pattern improved our software architecture and elevated system modularity.",
                "translation": "أدى اعتماد نمط تصميم المصنع إلى تحسين معمارية برمجياتنا ورفع النمطية وقابلية تقسيم النظام."
            }
        ]
    },
    {
        "title": "Developer Tooling and Git Workflow",
        "titleArabic": "أدوات المطورين وسير عمل جيت",
        "setting": "Open office engineering bench",
        "settingArabic": "منضدة الهندسة في المكتب المفتوح",
        "roles": ["Staff Engineer", "New Hire"],
        "vocabularyUsed": ["code editor", "integrated development environment", "compiler", "interpreter", "terminal emulator", "version control", "git repository", "commit changes", "branching", "pull request", "code review", "continuous integration", "package manager", "software library", "framework", "coding standard", "pair programming"],
        "lines": [
            {
                "speaker": "Staff Engineer",
                "text": "Did you configure your integrated development environment and install extensions for our web framework?",
                "translation": "هل قمت بتهيئة بيئة التطوير المتكاملة الخاصة بك وتثبيت إضافات إطار عمل الويب لدينا؟"
            },
            {
                "speaker": "New Hire",
                "text": "Yes, I also opened a terminal emulator alongside my lightweight code editor.",
                "translation": "نعم، وفتحت أيضاً محاكي الطرفية إلى جانب محرر الكود الخفيف الخاص بي."
            },
            {
                "speaker": "Staff Engineer",
                "text": "Our backend uses a fast compiler for microservices and a Python interpreter for analytics scripts.",
                "translation": "تستخدم واجهتنا الخلفية مترجماً سريعاً للخدمات المصغرة ومفسر بايثون لبرامج التحليلات النصية."
            },
            {
                "speaker": "New Hire",
                "text": "I used our package manager to download every required third-party software library.",
                "translation": "استخدمت مدير الحزم لدينا لتنزيل كل مكتبة برمجية خارجية مطلوبة."
            },
            {
                "speaker": "Staff Engineer",
                "text": "Great. When using version control, clone the remote Git repository and practice clean feature branching.",
                "translation": "رائع. عند استخدام نظام التحكم في الإصدارات، انسخ مستودع جيت البعيد ومارس التفريع البرمجي النظيف للميزات."
            },
            {
                "speaker": "New Hire",
                "text": "Once I commit changes to my branch, do I open a pull request immediately?",
                "translation": "بمجرد اعتماد التغييرات في فرعي، هل أفتح طلب سحب ودمج (PR) على الفور؟"
            },
            {
                "speaker": "Staff Engineer",
                "text": "Yes! Our continuous integration pipeline validates test suites, and we conduct a thorough peer code review.",
                "translation": "نعم! يختبر خط أنابيب التكامل المستمر لدينا حزم الاختبارات، ونجري مراجعة شاملة لكود الأقران."
            },
            {
                "speaker": "New Hire",
                "text": "I appreciate that our automated linter enforces team conformity to our strict coding standard.",
                "translation": "أنا أقدر أن أداة التدقيق الآلي لدينا تفرض التزام الفريق بمعيارنا الصارم لكتابة الكود."
            },
            {
                "speaker": "Staff Engineer",
                "text": "Let's do an hour of pair programming this afternoon to get you up to speed on our core API.",
                "translation": "دعنا نجري ساعة من البرمجة الزوجية بعد ظهر هذا اليوم لتسريع وتيرتك في التعامل مع واجهة برمجة التطبيقات الأساسية."
            }
        ]
    }
]

paras_day37 = [
    {
        "title": "Mastering the Craft of Clean Code",
        "titleArabic": "إتقان مهارة الكود النظيف",
        "kind": "informative",
        "vocabularyUsed": ["clean code", "refactoring", "documentation comment", "coding standard", "pair programming", "modularity", "abstraction"],
        "text": "Cultivating software craftsmanship requires continuous learning, thoughtful reflection, and relentless discipline. Professional programmers prioritize writing clean code that communicates intent effortlessly to future maintainers. Committing to regular refactoring prevents technical debt from accumulating, ensuring that software architecture remains flexible over years of iteration. Adding an expressive documentation comment above every complex algorithm clarifies nuances without cluttering implementation details. Engineering teams enforce a strict coding standard to ensure seamless style consistency across hundreds of repository files. By engaging in collaborative pair programming, developers exchange creative problem-solving techniques and discover elegant levels of abstraction that enhance system modularity and project longevity.",
        "translation": "تتطلب تنمية الحرفية البرمجية تعلماً مستمراً وتفكيراً واعياً وانضباطاً دؤوباً. ويعطي المبرمجون المحترفون الأولوية لكتابة كود نظيف يوصل المقصد دون عناء لمن يتولى صيانته مستقبلاً. كما أن الالتزام بإعادة هيكلة الكود بانتظام يمنع تراكم الديون الفنية، مما يضمن بقاء معمارية البرمجيات مرنة على مدى سنوات من التطور. وتوضح إضافة تعليق توثيق معبر فوق كل خوارزمية معقدة الفروق الدقيقة دون تشويش تفاصيل التنفيذ. وتفرض الفرق الهندسية معياراً صارماً لكتابة الكود لضمان اتساق الأسلوب بسلاسة عبر مئات ملفات المستودع. ومن خلال الانخراط في البرمجة الزوجية التعاونية، يتبادل المطورون تقنيات إبداعية لحل المشكلات ويكتشفون مستويات أنيقة من التجريد تعزز نمطية النظام وطول عمر المشروع."
    },
    {
        "title": "The Power of Modern Version Control",
        "titleArabic": "قوة أنظمة التحكم في الإصدارات الحديثة",
        "kind": "informative",
        "vocabularyUsed": ["version control", "git repository", "commit changes", "branching", "pull request", "code review", "continuous integration"],
        "text": "Modern global software development would be utterly impossible without distributed version control systems. Creating a centralized Git repository allows distributed teams spanning multiple continents to collaborate synchronously on identical files. Through disciplined feature branching, developers experiment fearlessly without destabilizing production deployments. When a contributor decides to commit changes, automated web hooks trigger a continuous integration build that tests every unit constraint. Opening an informative pull request invites team members to participate in constructive code review. Discussing proposed modifications openly before merging elevates code craftsmanship and nurtures an inclusive engineering culture centered on shared accountability and collective pride.",
        "translation": "سيكون تطوير البرمجيات العالمي الحديث مستحيلاً تماماً بدون أنظمة التحكم الموزعة في الإصدارات. ويتيح إنشاء مستودع جيت مركزي للفرق الموزعة عبر قارات متعددة التعاون بشكل متزامن على ملفات متطابقة. ومن خلال التفريع المنضبط للميزات، يختبر المطورون أفكارهم بلا خوف دون زعزعة استقرار عمليات النشر في الإنتاج. وعندما يقرر المساهم اعتماد التغييرات، تُطلق خطافات الويب الآلية بناء التكامل المستمر الذي يختبر كل قيود الوحدات البرمجية. ويدعو فتح طلب سحب ودمج مفيد أعضاء الفريق للمشاركة في مراجعة الكود البناءة. إن مناقشة التعديلات المقترحة علناً قبل الدمج ترتقي بحرفية الكود وتغذي ثقافة هندسية شاملة ترتكز على المسؤولية المشتركة والفخر الجماعي."
    },
    {
        "title": "From Syntax to Object-Oriented Architecture",
        "titleArabic": "من بناء الجملة إلى المعمارية كائنية التوجه",
        "kind": "reflective",
        "vocabularyUsed": ["programming language", "syntax", "algorithm", "data structure", "object-oriented", "design pattern", "software architecture"],
        "text": "Every programmer begins their computational voyage by memorizing the primitive syntax of their chosen programming language. Early milestones involve mastering loop constructs and combining a basic data structure with a sorting algorithm to solve practical challenges. However, building enterprise applications requires ascending to higher planes of reasoning. Developers embrace object-oriented paradigms to model intricate real-world entities into clean, cohesive modules. Implementing a proven design pattern provides time-tested solutions to recurring concurrency and scalability hurdles. Ultimately, mature software architecture balances immediate delivery requirements with long-term adaptability, transforming abstract mathematical symbols into living applications that enrich human civilization.",
        "translation": "يبدأ كل مبرمج رحلته الحاسوبية بحفظ القواعد النحوية الأولية للغة البرمجة التي اختارها. وتشمل المعالم الأولى إتقان تراكيب حلقات التكرار ودمج هيكل بيانات أساسي مع خوارزمية ترتيب لحل التحديات العملية. ومع ذلك، فإن بناء التطبيقات المؤسسية يتطلب الصعود إلى مستويات أعلى من التفكير المنطقي. حيث يتبنى المطورون النماذج كائنية التوجه لنمذجة كيانات العالم الحقيقي المعقدة في وحدات نظيفة ومترابطة. ويوفر تطبيق نمط تصميم مثبت حلولاً مجربة عبر الزمن لعقبات التزامن وقابلية التوسع المتكررة. وفي نهاية المطاف، توازن معمارية البرمجيات الناضجة بين متطلبات التسليم الفورية والقدرة على التكيف على المدى الطويل، محولة الرموز الرياضية المجردة إلى تطبيقات حية تثري الحضارة الإنسانية."
    }
]
