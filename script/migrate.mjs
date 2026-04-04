import { put } from '@vercel/blob';
import { PrismaClient } from '@prisma/client';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.join(__dirname, '..');

const prisma = new PrismaClient();

// ENV CHECK
if (!process.env.BLOB_READ_WRITE_TOKEN) {
  console.error("Missing BLOB_READ_WRITE_TOKEN");
  process.exit(1);
}

const PDF_FILES = [
  { p: "public/media/archives/2013/sportsante_302.pdf", y: "2013" },
  { p: "public/media/archives/2013/Sportsante_303.pdf", y: "2013" },
  { p: "public/media/archives/2013/Sportsante_301.pdf", y: "2013" },
  { p: "public/media/archives/2013/sportsante_304.pdf", y: "2013" },
  { p: "public/media/archives/2013/sportsante_305.pdf", y: "2013" },
  { p: "public/media/archives/2014/Sportsante_310.pdf", y: "2014" },
  { p: "public/media/archives/2014/Sportsante_307.pdf", y: "2014" },
  { p: "public/media/archives/2014/sportsante_306.pdf", y: "2014" },
  { p: "public/media/archives/2014/Sportsante_308.pdf", y: "2014" },
  { p: "public/media/archives/2014/Sportsante_309.pdf", y: "2014" },
  { p: "public/media/archives/2022/Sport-Santé_347.pdf", y: "2022" },
  { p: "public/media/archives/2022/Sport-Santé_346.pdf", y: "2022" },
  { p: "public/media/archives/2022/Sport-Santé_348.pdf", y: "2022" },
  { p: "public/media/archives/2022/Sport-Santé_349.pdf", y: "2022" },
  { p: "public/media/archives/2022/SportSante_350.pdf", y: "2022" },
  { p: "public/media/archives/2025/Sport-Santé_360.pdf", y: "2025" },
  { p: "public/media/archives/2025/Sport-Santé_361.pdf", y: "2025" },
  { p: "public/media/archives/2025/Sport-Santé_362.pdf", y: "2025" },
  { p: "public/media/archives/2025/Sport-Santé_359.pdf", y: "2025" },
  { p: "public/media/archives/2024/Sport-Santé_355.pdf", y: "2024" },
  { p: "public/media/archives/2024/Sport-Santé_356.pdf", y: "2024" },
  { p: "public/media/archives/2024/Sport-Santé_357.pdf", y: "2024" },
  { p: "public/media/archives/2024/Sport-Santé_358.pdf", y: "2024" },
  { p: "public/media/archives/2023/Sport-Santé_354.pdf", y: "2023" },
  { p: "public/media/archives/2023/Sport-Santé_353.pdf", y: "2023" },
  { p: "public/media/archives/2023/Sport-Santé_352.pdf", y: "2023" },
  { p: "public/media/archives/2023/Sport-Santé_351.pdf", y: "2023" },
  { p: "public/media/archives/2015/Sportsante_315.pdf", y: "2015" },
  { p: "public/media/archives/2015/Sportsante_314.pdf", y: "2015" },
  { p: "public/media/archives/2015/sportsante_311.pdf", y: "2015" },
  { p: "public/media/archives/2015/sportsante_313.pdf", y: "2015" },
  { p: "public/media/archives/2015/Sportsante_312.pdf", y: "2015" },
  { p: "public/media/archives/2012/sportsante_300.pdf", y: "2012" },
  { p: "public/media/archives/2012/sportsante_298.pdf", y: "2012" },
  { p: "public/media/archives/2012/sportsante_299.pdf", y: "2012" },
  { p: "public/media/archives/2012/sportsante_297.pdf", y: "2012" },
  { p: "public/media/archives/2012/sportsante_296.pdf", y: "2012" },
  { p: "public/media/archives/2017/Sportsante_323.pdf", y: "2017" },
  { p: "public/media/archives/2017/Sportsante_322.pdf", y: "2017" },
  { p: "public/media/archives/2017/Sportsante_321.pdf", y: "2017" },
  { p: "public/media/archives/2017/Sportsante_325.pdf", y: "2017" },
  { p: "public/media/archives/2017/Sportsante_324.pdf", y: "2017" },
  { p: "public/media/archives/2019/Sport-Santé_335.pdf", y: "2019" },
  { p: "public/media/archives/2019/Sport-Santé_334.pdf", y: "2019" },
  { p: "public/media/archives/2019/Sport-Santé_331.pdf", y: "2019" },
  { p: "public/media/archives/2019/Sport-Santé_333.pdf", y: "2019" },
  { p: "public/media/archives/2019/Sport-Santé_332.pdf", y: "2019" },
  { p: "public/media/archives/2021/Sport-Santé_341.pdf", y: "2021" },
  { p: "public/media/archives/2021/Sport-Santé_342.pdf", y: "2021" },
  { p: "public/media/archives/2021/Sport-Santé_343.pdf", y: "2021" },
  { p: "public/media/archives/2021/Sport-Santé_344.pdf", y: "2021" },
  { p: "public/media/archives/2021/Sport-Santé_345.pdf", y: "2021" },
  { p: "public/media/archives/2020/Sport-Santé_336.pdf", y: "2020" },
  { p: "public/media/archives/2020/Sport-Santé_337.pdf", y: "2020" },
  { p: "public/media/archives/2020/Sport-Santé_340.pdf", y: "2020" },
  { p: "public/media/archives/2020/Sport-Santé_339.pdf", y: "2020" },
  { p: "public/media/archives/2020/Sport-Santé_338.pdf", y: "2020" },
  { p: "public/media/archives/2018/Sportsante_329.pdf", y: "2018" },
  { p: "public/media/archives/2018/Sportsante_328.pdf", y: "2018" },
  { p: "public/media/archives/2018/Sportsante_330.pdf", y: "2018" },
  { p: "public/media/archives/2018/Sportsante_326.pdf", y: "2018" },
  { p: "public/media/archives/2018/sportsante_327.pdf", y: "2018" },
  { p: "public/media/archives/2011/SportSante_294.pdf", y: "2011" },
  { p: "public/media/archives/2011/sportsante_295.pdf", y: "2011" },
  { p: "public/media/archives/2016/Sportsante_316.pdf", y: "2016" },
  { p: "public/media/archives/2016/Sportsante_317.pdf", y: "2016" },
  { p: "public/media/archives/2016/Sportsante_320.pdf", y: "2016" },
  { p: "public/media/archives/2016/sportsante_319.pdf", y: "2016" },
  { p: "public/media/archives/2016/sportsante_318.pdf", y: "2016" }
];

async function run() {
  console.log("🚀 Starting Full Migration to Cloud (Blob + Postgres)...");

  // 1. MIGRATE PDF ARCHIVES
  for (const item of PDF_FILES) {
    try {
      const fullPath = path.join(ROOT, item.p);
      if (!fs.existsSync(fullPath)) continue;

      const filename = path.basename(item.p).normalize("NFC");
      const blobPath = `media/archives/${item.y}/${filename}`;
      
      const fileData = fs.readFileSync(fullPath);
      console.log(`📤 Uploading Archive: ${blobPath}`);
      
      const { url } = await put(blobPath, fileData, {
        access: 'public',
        addRandomSuffix: false,
      });

      // SYNC TO DATABASE
      const idMatch = filename.match(/_(\d+)\.pdf$/i);
      const issueNumber = idMatch ? idMatch[1] : filename.replace(/\.\w+$/, '');

      console.log(`📑 Registering DB Archive: N°${issueNumber}`);
      await prisma.archive.upsert({
        where: { issueNumber: issueNumber },
        update: { year: item.y, pdfUrl: url, title: `Sport Santé N°${issueNumber}` },
        create: { issueNumber: issueNumber, year: item.y, pdfUrl: url, title: `Sport Santé N°${issueNumber}` },
      });

    } catch (err) {
      console.error(`Failed to migrate ${item.p}:`, err);
    }
  }

  // 2. MIGRATE PHOTOS
  const PHOTO_FILES = [
    "public/media/photos/n329-aix-s-elance3.jpg",
    "public/media/photos/n329-aix-s-elance2.jpg",
    "public/media/photos/n328-sport-sante-1.jpg",
    "public/media/photos/n328-sport-sante-3.jpg",
    "public/media/photos/n329-aix-s-elance1.jpg",
    "public/media/photos/n328-sport-sante-2.jpg",
    "public/media/photos/n329-aix-s-elance4.jpg",
    "public/media/photos/bike-race.jpg",
    "public/media/photos/n328-sport-sante-18.jpg",
    "public/media/photos/n329-salon-des-sports-3.jpg",
    "public/media/photos/n329-salon-des-sports-38.jpg",
    "public/media/photos/n329-enduranne-4.jpg",
    "public/media/photos/bulletin-abonnement.png",
    "public/media/photos/n329-salon-des-sports-31.jpg",
    "public/media/photos/n329-enduranne-13.jpg",
    "public/media/photos/vendanges-14.jpg",
    "public/media/photos/n328-sport-sante-17.jpg",
    "public/media/photos/n328-sport-sante-16.jpg"
  ];

  for (const p of PHOTO_FILES) {
    try {
      const fullPath = path.join(ROOT, p);
      if (!fs.existsSync(fullPath)) continue;

      const filename = path.basename(p);
      const blobPath = `media/photos/${filename}`;
      
      const fileData = fs.readFileSync(fullPath);
      console.log(`📸 Uploading Photo: ${blobPath}`);
      
      await put(blobPath, fileData, {
        access: 'public',
        addRandomSuffix: false,
      });

    } catch (err) {
      console.error(`Failed to upload ${p}:`, err);
    }
  }

  // 3. FINAL COVER (N°363)
  const coverPath = 'public/media/covers/current/cover-363.jpg';
  const fullCoverPath = path.join(ROOT, coverPath);
  if (fs.existsSync(fullCoverPath)) {
    console.log("🖼️ Migrating Current Cover N°363...");
    const { url } = await put('media/covers/current/cover-363.jpg', fs.readFileSync(fullCoverPath), {
      access: 'public',
      addRandomSuffix: false,
    });

    // Register current issue in DB
    console.log("📓 Registering Current Issue N°363 in Database...");
    await prisma.issue.upsert({
      where: { issueNumber: '363' },
      update: {
        issueDate: 'Avril — Mai — Juin — 2024',
        headline: 'Dakar 2026 — Neels Theric a tutoyé les sommets',
        subheadline: 'Entre adrénaline et abnégation, le pilote aixois revient sur son expérience au rallye-raid le plus prestigieux du monde.',
        bodyText: 'Dans les dunes de l\'Arabie Saoudite, Neels Theric n\'a pas seulement piloté sa machine. Il a dompté ses propres limites physiques et mentales face à l\'adversité climatique et technique.',
        coverSrc: url,
        sommaireJson: JSON.stringify([
          { id: 1, text: 'Dakar 2026 — Le retour triomphal de Neels Théric' },
          { id: 2, text: 'Dossier — Le Sport au service de la Santé Publique' },
          { id: 3, text: 'Portfolio — Les Moments Forts de l\'Édition Printemps' },
          { id: 4, text: 'Grand Angle — Le Tennis au Pays dAix' },
        ]),
        isCurrent: true,
      },
      create: {
        issueNumber: '363',
        issueDate: 'Avril — Mai — Juin — 2024',
        headline: 'Dakar 2026 — Neels Theric a tutoyé les sommets',
        subheadline: 'Entre adrénaline et abnégation, le pilote aixois revient sur son expérience au rallye-raid le plus prestigieux du monde.',
        bodyText: 'Dans les dunes de l\'Arabie Saoudite, Neels Theric n\'a pas seulement piloté sa machine. Il a dompté ses propres limites physiques et mentales face à l\'adversité climatique et technique.',
        coverSrc: url,
        sommaireJson: JSON.stringify([
          { id: 1, text: 'Dakar 2026 — Le retour triomphal de Neels Théric' },
          { id: 2, text: 'Dossier — Le Sport au service de la Santé Publique' },
          { id: 3, text: 'Portfolio — Les Moments Forts de l\'Édition Printemps' },
          { id: 4, text: 'Grand Angle — Le Tennis au Pays dAix' },
        ]),
        isCurrent: true,
      },
    });
  }

  await prisma.$disconnect();
  console.log("\n✅ ALL DATA MIGRATED TO CLOUD SUCCESSFULLY!");
}

run();
