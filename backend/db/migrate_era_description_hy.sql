-- Migration: add Armenian descriptions for eras

ALTER TABLE eras ADD COLUMN IF NOT EXISTS description_hy TEXT;

UPDATE eras SET description_hy = 'Վանա լճի շուրջ կենտրոնացած Երկաթի դարի հզոր թագավորություն՝ Հայաստանի նախորդ պետությունը' WHERE name = 'Kingdom of Urartu';
UPDATE eras SET description_hy = 'Ուրարտուի անկումը մեդական արշավանքից հետո. վաղ հայկական ցեղերի համախմբում' WHERE name = 'Post-Urartu / Early Armenia';
UPDATE eras SET description_hy = 'Հայաստանի Սատրապությունը Աքեմենյան Պարսկաստանի ներքո. Երվանդունի կուսակալները' WHERE name = 'Satrapy of Armenia';
UPDATE eras SET description_hy = 'Ալեքսանդրից հետո Երվանդունիների օրոք կիսանկախ թագավորություն' WHERE name = 'Orontid Kingdom';
UPDATE eras SET description_hy = 'Հայկական հզորության գագաթ. Տիգրան Բ-ի կայսրությունը ձգվեց Կասպից ծովից Միջերկրական ծով' WHERE name = 'Artaxiad Kingdom';
UPDATE eras SET description_hy = 'Արշակունյաց դինաստիա. Հայաստանը 301 թ. դարձավ աշխարհի առաջին քրիստոնյա պետությունը' WHERE name = 'Arsacid Armenia';
UPDATE eras SET description_hy = 'Պարսկական կառավարմամբ նահանգ Արշակունյաց թագավորության անկումից հետո' WHERE name = 'Marzpanate of Armenia';
UPDATE eras SET description_hy = 'Արաբական Խալիֆայության ներքո. հայերը դիմադրում են, բայց մնում օտար տիրապետության տակ' WHERE name = 'Arab-controlled Armenia';
UPDATE eras SET description_hy = 'Միջնադարյան Հայաստանի ոսկեդարը. Անին չափերով մրցում էր Կոստանդնուպոլսի հետ' WHERE name = 'Bagratid Kingdom';
UPDATE eras SET description_hy = 'Սելջուկյան արշավանքից հետո. Զաքարյաններ, Կյուրիկյաններ ու այլ տոհմեր' WHERE name = 'Fragmented Kingdoms';
UPDATE eras SET description_hy = 'Կիլիկիայի հայկական Խաչակրաց պետություն. արևմտյան ուժերի կարևոր դաշնակից' WHERE name = 'Armenian Kingdom of Cilicia';
UPDATE eras SET description_hy = 'Հայաստանը բաժանված Օսմանյան ու Սեֆևյան/Ղաջարյան Պարսկաստանի միջև' WHERE name = 'Ottoman/Persian Rule';
UPDATE eras SET description_hy = 'Արևելյան Հայաստանը Ռուսական կայսրության ներքո Թուրքմենչայի պայմանագրից հետո' WHERE name = 'Russian Armenia';
UPDATE eras SET description_hy = 'Առաջին անկախ հայկական պետությունն արդի պատմության մեջ. 1920 թ. պարտություն Խորհրդային Ռուսաստանի դեմ' WHERE name = 'First Republic of Armenia';
UPDATE eras SET description_hy = 'Հայկական Խորհրդային Սոցիալիստական Հանրապետություն. ԽՍՀՄ-ի կազմում' WHERE name = 'Soviet Armenia';
UPDATE eras SET description_hy = 'Անկախ Հայաստանի Հանրապետություն ԽՍՀՄ-ի փլուզումից ի վեր' WHERE name = 'Republic of Armenia';
