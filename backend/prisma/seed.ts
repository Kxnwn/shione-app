import { PrismaClient, VerseCategory } from "@prisma/client";

const prisma = new PrismaClient();

const main = async () => {
    await prisma.bibleVerse.deleteMany();

    await prisma.bibleVerse.createMany({
        data: [

            // ❤️ LOVE
            {
                verse: "Love is patient, love is kind. It does not envy, it does not boast, it is not proud.",
                reference: "1 Corinthians 13:4",
                category: VerseCategory.LOVE,
            },
            {
                verse: "Above all, love each other deeply, because love covers over a multitude of sins.",
                reference: "1 Peter 4:8",
                category: VerseCategory.LOVE,
            },
            {
                verse: "Be devoted to one another in love. Honor one another above yourselves.",
                reference: "Romans 12:10",
                category: VerseCategory.LOVE,
            },
            {
                verse: "My command is this: Love each other as I have loved you.",
                reference: "John 15:12",
                category: VerseCategory.LOVE,
            },
            {
                verse: "And now these three remain: faith, hope and love. But the greatest of these is love.",
                reference: "1 Corinthians 13:13",
                category: VerseCategory.LOVE,
            },

            // 🌈 HOPE
            {
                verse: "For I know the plans I have for you, declares the Lord, plans to prosper you and not to harm you, plans to give you hope and a future.",
                reference: "Jeremiah 29:11",
                category: VerseCategory.HOPE,
            },
            {
                verse: "Those who hope in the Lord will renew their strength. They will soar on wings like eagles.",
                reference: "Isaiah 40:31",
                category: VerseCategory.HOPE,
            },
            {
                verse: "May the God of hope fill you with all joy and peace as you trust in him.",
                reference: "Romans 15:13",
                category: VerseCategory.HOPE,
            },
            {
                verse: "We have this hope as an anchor for the soul, firm and secure.",
                reference: "Hebrews 6:19",
                category: VerseCategory.HOPE,
            },
            {
                verse: "The Lord delights in those who fear him, who put their hope in his unfailing love.",
                reference: "Psalm 147:11",
                category: VerseCategory.HOPE,
            },

            // 🕊️ PEACE
            {
                verse: "Peace I leave with you; my peace I give you. Do not let your hearts be troubled and do not be afraid.",
                reference: "John 14:27",
                category: VerseCategory.PEACE,
            },
            {
                verse: "Do not be anxious about anything, but in every situation, by prayer and petition, present your requests to God.",
                reference: "Philippians 4:6-7",
                category: VerseCategory.PEACE,
            },
            {
                verse: "You will keep in perfect peace those whose minds are steadfast, because they trust in you.",
                reference: "Isaiah 26:3",
                category: VerseCategory.PEACE,
            },
            {
                verse: "The Lord gives strength to his people; the Lord blesses his people with peace.",
                reference: "Psalm 29:11",
                category: VerseCategory.PEACE,
            },
            {
                verse: "Cast all your anxiety on him because he cares for you.",
                reference: "1 Peter 5:7",
                category: VerseCategory.PEACE,
            },

            // 😊 JOY
            {
                verse: "The joy of the Lord is your strength.",
                reference: "Nehemiah 8:10",
                category: VerseCategory.JOY,
            },
            {
                verse: "Rejoice in the Lord always. I will say it again: Rejoice!",
                reference: "Philippians 4:4",
                category: VerseCategory.JOY,
            },
            {
                verse: "Shout for joy to the Lord, all the earth. Worship the Lord with gladness.",
                reference: "Psalm 100:1-2",
                category: VerseCategory.JOY,
            },
            {
                verse: "You make known to me the path of life; you will fill me with joy in your presence.",
                reference: "Psalm 16:11",
                category: VerseCategory.JOY,
            },
            {
                verse: "Though you have not seen him, you love him... you are filled with an inexpressible and glorious joy.",
                reference: "1 Peter 1:8",
                category: VerseCategory.JOY,
            },

            // 🙏 GRATITUDE
            {
                verse: "Give thanks in all circumstances; for this is God's will for you in Christ Jesus.",
                reference: "1 Thessalonians 5:18",
                category: VerseCategory.GRATITUDE,
            },
            {
                verse: "Enter his gates with thanksgiving and his courts with praise; give thanks to him and praise his name.",
                reference: "Psalm 100:4",
                category: VerseCategory.GRATITUDE,
            },
            {
                verse: "Give thanks to the Lord, for he is good; his love endures forever.",
                reference: "Psalm 107:1",
                category: VerseCategory.GRATITUDE,
            },
            {
                verse: "Let the peace of Christ rule in your hearts... and be thankful.",
                reference: "Colossians 3:15",
                category: VerseCategory.GRATITUDE,
            },
            {
                verse: "Every good and perfect gift is from above, coming down from the Father of the heavenly lights.",
                reference: "James 1:17",
                category: VerseCategory.GRATITUDE,
            },

        ],
    });
};

main().finally(async () => await prisma.$disconnect());