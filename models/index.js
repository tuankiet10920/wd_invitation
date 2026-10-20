import defineUser from "./users.js";
import defineVerifyToken from "./verify-tokens.js";

import defineImageType from "./image-types.js";
import defineMusicType from "./music-types.js";
import defineAnimationType from "./animation-types.js";
import defineFeature from "./features.js";
import defineCategoryWeddingCard from "./category-wedding-cards.js";
import defineArticleType from "./article-types.js";
import defineSetting from "./settings.js";

import definePackage from "./packages.js";
import definePackageFeature from "./package-features.js";
import defineImage from "./images.js";
import defineMusic from "./musics.js";
import defineAnimation from "./animations.js";

import defineArticle from "./articles.js";
import defineWeddingCard from "./wedding-cards.js";
import defineOrder from "./orders.js";
import defineInvitor from "./invitors.js";
import defineNews from "./news.js";
import defineGallery from "./galleries.js";
import defineWish from "./wishes.js";
import defineGift from "./gifts.js";
import defineSeoPage from "./seo-pages.js";
import defineWidget from "./widgets.js";
import defineEffect from "./effects.js";
import defineEffectType from "./effect_types.js";

import defineWebsiteType from "./website-types.js";
import defineTag from "./tags.js";
import defineWebsite from "./websites.js";
import defineWebsiteTag from "./website-tags.js";
import defineWebsiteImage from "./website-images.js";

import defineFontType from "./font-types.js";
import defineFont from "./fonts.js";
import defineAcceptInvitation from "./accept-invitations.js";
import defineQrBox from "./qr_boxes.js";

const db = {};

export const loadAndAssociateModels = (sequelize, DataTypes) => {
  const models = [
    defineUser(sequelize, DataTypes),
    defineVerifyToken(sequelize, DataTypes),

    defineImageType(sequelize, DataTypes),
    defineMusicType(sequelize, DataTypes),
    defineAnimationType(sequelize, DataTypes),
    defineFeature(sequelize, DataTypes),
    defineCategoryWeddingCard(sequelize, DataTypes),
    defineArticleType(sequelize, DataTypes),
    defineSetting(sequelize, DataTypes),

    definePackage(sequelize, DataTypes),
    definePackageFeature(sequelize, DataTypes),
    defineImage(sequelize, DataTypes),
    defineMusic(sequelize, DataTypes),
    defineAnimation(sequelize, DataTypes),

    defineArticle(sequelize, DataTypes),
    defineWeddingCard(sequelize, DataTypes),
    defineOrder(sequelize, DataTypes),
    defineInvitor(sequelize, DataTypes),
    defineNews(sequelize, DataTypes),
    defineGallery(sequelize, DataTypes),
    defineWish(sequelize, DataTypes),
    defineGift(sequelize, DataTypes),
    defineSeoPage(sequelize, DataTypes),
    defineWidget(sequelize, DataTypes),
    defineEffect(sequelize, DataTypes),
    defineEffectType(sequelize, DataTypes),

    defineWebsiteType(sequelize, DataTypes),
    defineTag(sequelize, DataTypes),
    defineWebsite(sequelize, DataTypes),
    defineWebsiteTag(sequelize, DataTypes),
    defineWebsiteImage(sequelize, DataTypes),

    defineFontType(sequelize, DataTypes),
    defineFont(sequelize, DataTypes),
    defineAcceptInvitation(sequelize, DataTypes),
    defineQrBox(sequelize, DataTypes),
  ];

  models.forEach((model) => {
    if (model && model.name) {
      db[model.name] = model;
    }
  });

  // associate here

  // =========================================================
  // ## USERS & AUTH ##
  // =========================================================
  db.User.hasMany(db.VerifyToken, { foreignKey: "id_user", as: "tokens" });
  db.VerifyToken.belongsTo(db.User, { foreignKey: "id_user", as: "user" });

  db.User.belongsTo(db.Package, { foreignKey: "id_package", as: "package" });
  db.Package.hasMany(db.User, { foreignKey: "id_package", as: "users" });

  db.User.hasMany(db.Image, { foreignKey: "id_user", as: "images" });
  db.User.hasMany(db.Music, { foreignKey: "id_user", as: "musics" });
  db.User.hasMany(db.Animation, { foreignKey: "id_user", as: "animations" });
  db.User.hasMany(db.Article, { foreignKey: "id_user", as: "articles" });
  db.User.hasMany(db.WeddingCard, {
    foreignKey: "id_user",
    as: "weddingCards",
  });
  db.User.hasMany(db.Order, { foreignKey: "id_user", as: "orders" });

  // =========================================================
  // ## MEDIA (Images, Musics, Animations) ##
  // =========================================================

  // Images
  db.Image.belongsTo(db.User, { foreignKey: "id_user", as: "user" });
  db.Image.belongsTo(db.ImageType, { foreignKey: "id_image_type", as: "imageType" });
  db.ImageType.hasMany(db.Image, { foreignKey: "id_image_type", as: "images" });
  db.Image.belongsTo(db.Package, {
    foreignKey: "id_min_package",
    as: "minPackage",
  });

  // Musics
  db.Music.belongsTo(db.User, { foreignKey: "id_user", as: "user" });
  db.Music.belongsTo(db.MusicType, { foreignKey: "id_music_type", as: "type" });
  db.MusicType.hasMany(db.Music, { foreignKey: "id_music_type", as: "musics" });
  db.Music.belongsTo(db.Package, {
    foreignKey: "id_min_package",
    as: "minPackage",
  });

  // Animations
  db.Animation.belongsTo(db.User, { foreignKey: "id_user", as: "user" });
  db.Animation.belongsTo(db.AnimationType, {
    foreignKey: "id_animation_type",
    as: "type",
  });
  db.AnimationType.hasMany(db.Animation, {
    foreignKey: "id_animation_type",
    as: "animations",
  });
  db.Animation.belongsTo(db.Package, {
    foreignKey: "id_min_package",
    as: "minPackage",
  });

  // =========================================================
  // ## WEDDING CARDS ##
  // =========================================================
  db.WeddingCard.belongsTo(db.User, { foreignKey: "id_user", as: "user" });
  db.WeddingCard.belongsTo(db.CategoryWeddingCard, {
    foreignKey: "id_category_wedding_card",
    as: "category",
  });
  db.CategoryWeddingCard.hasMany(db.WeddingCard, {
    foreignKey: "id_category_wedding_card",
    as: "weddingCards",
  });

  db.WeddingCard.belongsTo(db.Package, {
    foreignKey: "id_package",
    as: "package",
  });
  db.Package.hasMany(db.WeddingCard, {
    foreignKey: "id_package",
    as: "weddingCardsPackage",
  });

  db.WeddingCard.hasMany(db.Invitor, { foreignKey: "id_card", as: "invitors" });
  db.Invitor.belongsTo(db.WeddingCard, {
    foreignKey: "id_card",
    as: "weddingCard"
  });

  db.WeddingCard.hasMany(db.Wish, { foreignKey: "id_wedding_card", as: "wishes" });
  db.Wish.belongsTo(db.WeddingCard, { foreignKey: "id_wedding_card", as: "weddingCard" });

  db.WeddingCard.hasMany(db.AcceptInvitation, { foreignKey: "id_wedding_card", as: "acceptInvitations" });
  db.AcceptInvitation.belongsTo(db.WeddingCard, { foreignKey: "id_wedding_card", as: "weddingCard" });

  db.WeddingCard.hasMany(db.QrBox, { foreignKey: "id_wedding_card", as: "qrBoxes" });
  db.QrBox.belongsTo(db.WeddingCard, { foreignKey: "id_wedding_card", as: "weddingCard" });

  // =========================================================
  // ## ARTICLES ##
  // =========================================================
  db.Article.belongsTo(db.User, { foreignKey: "id_user", as: "user" });
  db.Article.belongsTo(db.ArticleType, {
    foreignKey: "id_type_news",
    as: "type",
  });
  db.ArticleType.hasMany(db.Article, {
    foreignKey: "id_type_news",
    as: "articles",
  });

  // =========================================================
  // ## NEWS & GALLERIES ##
  // =========================================================
  db.News.hasMany(db.Gallery, { foreignKey: "id_news", as: "galleries" });
  db.Gallery.belongsTo(db.News, { foreignKey: "id_news", as: "news" });

  // =========================================================
  // ## PACKAGES & FEATURES & ORDERS ##
  // =========================================================
  // Packages <-> Features (Many-to-Many)
  db.Package.belongsToMany(db.Feature, {
    through: db.PackageFeature,
    foreignKey: "id_package",
    as: "features",
  });
  db.Feature.belongsToMany(db.Package, {
    through: db.PackageFeature,
    foreignKey: "id_feature",
    as: "packages",
  });

  // PackageFeatures -> Features (Many-to-Many)
  db.PackageFeature.belongsTo(db.Feature, {
    foreignKey: "id_feature",
    as: "features",
  });

  // Package usages (Foreign Keys in other tables)
  db.Package.hasMany(db.Order, { foreignKey: "id_package", as: "orders" });
  db.Package.hasMany(db.Image, { foreignKey: "id_min_package", as: "images" });
  db.Package.hasMany(db.Music, { foreignKey: "id_min_package", as: "musics" });
  db.Package.hasMany(db.Animation, {
    foreignKey: "id_min_package",
    as: "animations",
  });
  db.Package.hasMany(db.Widget, { foreignKey: "id_min_package", as: "widgets" });
  db.Widget.belongsTo(db.Package, { foreignKey: "id_min_package", as: "minPackage" });

  db.Package.hasMany(db.Effect, { foreignKey: "id_min_package", as: "effects" });
  db.Effect.belongsTo(db.Package, { foreignKey: "id_min_package", as: "minPackage" });

  // =========================================================
  // ## EFFECTS ##
  // =========================================================
  db.Effect.belongsTo(db.EffectType, { foreignKey: "id_type_effect", as: "type" });
  db.EffectType.hasMany(db.Effect, { foreignKey: "id_type_effect", as: "effects" });

  // =========================================================
  // ## FONTS ##
  // =========================================================
  db.Font.belongsTo(db.FontType, { foreignKey: "id_font_type", as: "type" });
  db.FontType.hasMany(db.Font, { foreignKey: "id_font_type", as: "fonts" });

  // =========================================================
  // ## WEBSITES & TAGS ##
  // =========================================================
  db.Website.belongsTo(db.WebsiteType, {
    foreignKey: "id_website_type",
    as: "type",
  });
  db.WebsiteType.hasMany(db.Website, {
    foreignKey: "id_website_type",
    as: "websites",
  });

  db.Website.belongsTo(db.User, { foreignKey: "id_user", as: "user" });
  db.User.hasMany(db.Website, { foreignKey: "id_user", as: "websites" });

  db.Website.belongsTo(db.Package, { foreignKey: "id_package", as: "package" });
  db.Package.hasMany(db.Website, { foreignKey: "id_package", as: "websites" });

  // Website <-> Tags (Many-to-Many)
  db.Website.belongsToMany(db.Tag, {
    through: db.WebsiteTag,
    foreignKey: "id_website",
    as: "tags",
  });
  db.Tag.belongsToMany(db.Website, {
    through: db.WebsiteTag,
    foreignKey: "id_tag",
    as: "websites",
  });

  // Website <-> WebsiteImages
  db.Website.hasMany(db.WebsiteImage, {
    foreignKey: "id_website",
    as: "images",
  });
  db.WebsiteImage.belongsTo(db.Website, {
    foreignKey: "id_website",
    as: "website",
  });

  // Orders
  db.Order.belongsTo(db.User, { foreignKey: "id_user", as: "user" });
  db.Order.belongsTo(db.Package, { foreignKey: "id_package", as: "package" });

  return {
    sequelize,
    db,
  };
};
