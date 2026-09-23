-- CreateTable
CREATE TABLE "User" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "email" TEXT NOT NULL,
    "passwordHash" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "role" TEXT NOT NULL DEFAULT 'USER',
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL
);

-- CreateTable
CREATE TABLE "UserSettings" (
    "userId" TEXT NOT NULL PRIMARY KEY,
    "theme" TEXT NOT NULL DEFAULT 'system',
    "dailyTarget" INTEGER NOT NULL DEFAULT 50,
    "autoplayAudio" BOOLEAN NOT NULL DEFAULT false,
    "audioSpeed" TEXT NOT NULL DEFAULT 'normal',
    "audioProvider" TEXT NOT NULL DEFAULT 'microsoft',
    "updatedAt" DATETIME NOT NULL,
    CONSTRAINT "UserSettings_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "Day" (
    "dayNumber" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "title" TEXT NOT NULL,
    "topic" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "stage" TEXT NOT NULL,
    "focus" TEXT NOT NULL
);

-- CreateTable
CREATE TABLE "VocabularyItem" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "headword" TEXT NOT NULL,
    "pronunciation" TEXT,
    "partOfSpeech" TEXT,
    "definition" TEXT NOT NULL,
    "example" TEXT NOT NULL,
    "translation" TEXT,
    "exampleArabic" TEXT,
    "verbForms" TEXT,
    "relatedForms" TEXT NOT NULL DEFAULT '[]',
    "collocations" TEXT NOT NULL DEFAULT '[]',
    "synonyms" TEXT NOT NULL DEFAULT '[]',
    "antonyms" TEXT NOT NULL DEFAULT '[]',
    "tags" TEXT NOT NULL DEFAULT '[]',
    "dayNumber" INTEGER NOT NULL,
    "order" INTEGER NOT NULL,
    CONSTRAINT "VocabularyItem_dayNumber_fkey" FOREIGN KEY ("dayNumber") REFERENCES "Day" ("dayNumber") ON DELETE RESTRICT ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "GrammarLesson" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "dayNumber" INTEGER NOT NULL,
    "order" INTEGER NOT NULL,
    "title" TEXT NOT NULL,
    "titleArabic" TEXT,
    "explanation" TEXT NOT NULL,
    "explanationArabic" TEXT,
    "structures" TEXT NOT NULL DEFAULT '[]',
    "examples" TEXT NOT NULL DEFAULT '[]',
    "commonUsage" TEXT NOT NULL DEFAULT '[]',
    "commonMistakes" TEXT NOT NULL DEFAULT '[]',
    CONSTRAINT "GrammarLesson_dayNumber_fkey" FOREIGN KEY ("dayNumber") REFERENCES "Day" ("dayNumber") ON DELETE RESTRICT ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "Conversation" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "dayNumber" INTEGER NOT NULL,
    "order" INTEGER NOT NULL,
    "title" TEXT NOT NULL,
    "titleArabic" TEXT,
    "setting" TEXT NOT NULL,
    "settingArabic" TEXT,
    "lines" TEXT NOT NULL,
    CONSTRAINT "Conversation_dayNumber_fkey" FOREIGN KEY ("dayNumber") REFERENCES "Day" ("dayNumber") ON DELETE RESTRICT ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "ConversationVocabulary" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "conversationId" TEXT NOT NULL,
    "vocabularyId" TEXT NOT NULL,
    "isReinforcement" BOOLEAN NOT NULL DEFAULT false,
    CONSTRAINT "ConversationVocabulary_conversationId_fkey" FOREIGN KEY ("conversationId") REFERENCES "Conversation" ("id") ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT "ConversationVocabulary_vocabularyId_fkey" FOREIGN KEY ("vocabularyId") REFERENCES "VocabularyItem" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "Paragraph" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "dayNumber" INTEGER NOT NULL,
    "order" INTEGER NOT NULL,
    "title" TEXT NOT NULL,
    "kind" TEXT NOT NULL,
    "text" TEXT NOT NULL,
    "translation" TEXT,
    "titleArabic" TEXT,
    CONSTRAINT "Paragraph_dayNumber_fkey" FOREIGN KEY ("dayNumber") REFERENCES "Day" ("dayNumber") ON DELETE RESTRICT ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "ParagraphVocabulary" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "paragraphId" TEXT NOT NULL,
    "vocabularyId" TEXT NOT NULL,
    "isReinforcement" BOOLEAN NOT NULL DEFAULT false,
    CONSTRAINT "ParagraphVocabulary_paragraphId_fkey" FOREIGN KEY ("paragraphId") REFERENCES "Paragraph" ("id") ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT "ParagraphVocabulary_vocabularyId_fkey" FOREIGN KEY ("vocabularyId") REFERENCES "VocabularyItem" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "UserVocabulary" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "userId" TEXT NOT NULL,
    "vocabularyId" TEXT NOT NULL,
    "state" TEXT NOT NULL DEFAULT 'UNLEARNED',
    "isDifficult" BOOLEAN NOT NULL DEFAULT false,
    "difficultAddedAt" DATETIME,
    "usedInConversation" BOOLEAN NOT NULL DEFAULT false,
    "firstViewedAt" DATETIME,
    "learnedAt" DATETIME,
    "reviewAddedAt" DATETIME,
    "reviewDueAt" DATETIME,
    "masteredAt" DATETIME,
    "usedAt" DATETIME,
    "updatedAt" DATETIME NOT NULL,
    CONSTRAINT "UserVocabulary_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User" ("id") ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT "UserVocabulary_vocabularyId_fkey" FOREIGN KEY ("vocabularyId") REFERENCES "VocabularyItem" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "VocabularyHistory" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "userId" TEXT NOT NULL,
    "vocabularyId" TEXT NOT NULL,
    "userVocabularyId" TEXT,
    "event" TEXT NOT NULL,
    "detail" TEXT,
    "dayNumber" INTEGER,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "VocabularyHistory_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User" ("id") ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT "VocabularyHistory_userVocabularyId_fkey" FOREIGN KEY ("userVocabularyId") REFERENCES "UserVocabulary" ("id") ON DELETE SET NULL ON UPDATE CASCADE,
    CONSTRAINT "VocabularyHistory_vocabularyId_fkey" FOREIGN KEY ("vocabularyId") REFERENCES "VocabularyItem" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "DayProgress" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "userId" TEXT NOT NULL,
    "dayNumber" INTEGER NOT NULL,
    "status" TEXT NOT NULL DEFAULT 'NOT_STARTED',
    "viewedVocabulary" TEXT NOT NULL DEFAULT '[]',
    "grammarViewed" BOOLEAN NOT NULL DEFAULT false,
    "conversationsViewed" TEXT NOT NULL DEFAULT '[]',
    "paragraphsViewed" TEXT NOT NULL DEFAULT '[]',
    "startedAt" DATETIME,
    "completedAt" DATETIME,
    "updatedAt" DATETIME NOT NULL,
    CONSTRAINT "DayProgress_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User" ("id") ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT "DayProgress_dayNumber_fkey" FOREIGN KEY ("dayNumber") REFERENCES "Day" ("dayNumber") ON DELETE RESTRICT ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "ConfusableGroup" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "slug" TEXT NOT NULL,
    "category" TEXT NOT NULL,
    "order" INTEGER NOT NULL,
    "title" TEXT NOT NULL,
    "titleArabic" TEXT NOT NULL,
    "summary" TEXT NOT NULL,
    "summaryArabic" TEXT NOT NULL,
    "words" TEXT NOT NULL DEFAULT '[]',
    "examples" TEXT NOT NULL DEFAULT '[]',
    "mistakes" TEXT NOT NULL DEFAULT '[]',
    "tips" TEXT NOT NULL DEFAULT '[]',
    "tipsArabic" TEXT NOT NULL DEFAULT '[]'
);

-- CreateIndex
CREATE UNIQUE INDEX "User_email_key" ON "User"("email");

-- CreateIndex
CREATE UNIQUE INDEX "VocabularyItem_headword_key" ON "VocabularyItem"("headword");

-- CreateIndex
CREATE INDEX "VocabularyItem_dayNumber_idx" ON "VocabularyItem"("dayNumber");

-- CreateIndex
CREATE INDEX "VocabularyItem_headword_idx" ON "VocabularyItem"("headword");

-- CreateIndex
CREATE UNIQUE INDEX "GrammarLesson_dayNumber_order_key" ON "GrammarLesson"("dayNumber", "order");

-- CreateIndex
CREATE UNIQUE INDEX "Conversation_dayNumber_order_key" ON "Conversation"("dayNumber", "order");

-- CreateIndex
CREATE INDEX "ConversationVocabulary_vocabularyId_idx" ON "ConversationVocabulary"("vocabularyId");

-- CreateIndex
CREATE UNIQUE INDEX "ConversationVocabulary_conversationId_vocabularyId_key" ON "ConversationVocabulary"("conversationId", "vocabularyId");

-- CreateIndex
CREATE UNIQUE INDEX "Paragraph_dayNumber_order_key" ON "Paragraph"("dayNumber", "order");

-- CreateIndex
CREATE INDEX "ParagraphVocabulary_vocabularyId_idx" ON "ParagraphVocabulary"("vocabularyId");

-- CreateIndex
CREATE UNIQUE INDEX "ParagraphVocabulary_paragraphId_vocabularyId_key" ON "ParagraphVocabulary"("paragraphId", "vocabularyId");

-- CreateIndex
CREATE INDEX "UserVocabulary_userId_state_idx" ON "UserVocabulary"("userId", "state");

-- CreateIndex
CREATE INDEX "UserVocabulary_userId_isDifficult_idx" ON "UserVocabulary"("userId", "isDifficult");

-- CreateIndex
CREATE INDEX "UserVocabulary_userId_usedInConversation_idx" ON "UserVocabulary"("userId", "usedInConversation");

-- CreateIndex
CREATE UNIQUE INDEX "UserVocabulary_userId_vocabularyId_key" ON "UserVocabulary"("userId", "vocabularyId");

-- CreateIndex
CREATE INDEX "VocabularyHistory_userId_vocabularyId_createdAt_idx" ON "VocabularyHistory"("userId", "vocabularyId", "createdAt");

-- CreateIndex
CREATE INDEX "DayProgress_userId_status_idx" ON "DayProgress"("userId", "status");

-- CreateIndex
CREATE UNIQUE INDEX "DayProgress_userId_dayNumber_key" ON "DayProgress"("userId", "dayNumber");

-- CreateIndex
CREATE UNIQUE INDEX "ConfusableGroup_slug_key" ON "ConfusableGroup"("slug");

-- CreateIndex
CREATE INDEX "ConfusableGroup_category_idx" ON "ConfusableGroup"("category");

-- CreateIndex
CREATE INDEX "ConfusableGroup_order_idx" ON "ConfusableGroup"("order");
