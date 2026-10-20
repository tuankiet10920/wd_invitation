import fs from "node:fs/promises";
import path from "node:path";
import { getCookie } from "h3";
import jwt from "jsonwebtoken";
import { services } from "~~/composables/FuncServices";
import { WeddingCardData } from "../data/card-template";
import { UserData } from "../data/user";
import FormatResponse from "~~/composables/FormatResponse";
import { Queue, Worker } from "bullmq";
import { redisConnection } from "~~/server/utils/redis";

const WeddingCard = new WeddingCardData();
const User = new UserData();

const UPDATE_QUEUE_NAME = "update_wedding_card";

const exportToSeeder = async (cardData: any) => {
  try {
    const seederDir = path.join(process.cwd(), "seeders", "wcards");
    try {
      await fs.access(seederDir);
    } catch {
      await fs.mkdir(seederDir, { recursive: true });
    }

    const filename = `wedding_card_${cardData.id || cardData.url || 'temp'}.json`;
    const filePath = path.join(seederDir, filename);

    // Format for seeder
    const seederRecord = {
      name: cardData.name,
      meta_desc: cardData.meta_desc,
      image_page: cardData.image_page,
      avatar: cardData.avatar,
      url: cardData.url,
      is_custom_url: cardData.is_custom_url || false,
      is_public: cardData.is_public !== undefined ? cardData.is_public : true,
      is_publish: cardData.is_publish !== undefined ? cardData.is_publish : true,
      views: cardData.views || 0,
      height: cardData.height || 1024,
      is_template: cardData.is_template !== undefined ? cardData.is_template : true,
      is_template_user: cardData.is_template_user || false,
      id_category_wedding_card: cardData.id_category_wedding_card || 1,
      id_user: cardData.id_user || 1,
      id_package: cardData.id_package || 3,
      music: cardData.music,
      background: cardData.background,
      nodes: cardData.nodes,
      effect: cardData.effect,
      createdAt: cardData.createdAt || new Date(),
      updatedAt: new Date(),
    };

    await fs.writeFile(filePath, JSON.stringify(seederRecord, null, 2));
    console.log(`[SeederExport] Saved record to ${filename}`);
  } catch (error) {
    console.error("[SeederExport] Failed to export card:", error);
  }
};

const updateQueue = new Queue(UPDATE_QUEUE_NAME, {
  connection: redisConnection,
});

const worker = new Worker(
  UPDATE_QUEUE_NAME,
  async (job) => {
    const { id, body, isAdmin } = job.data;
    console.log(`[Queue update_wedding_card] Đang xử lý update card ID: ${id}`);
    try {
      await WeddingCard.update(id, body);
      
      if (isAdmin) {
         const fullCard = await WeddingCard.getById(id);
         if (fullCard) await exportToSeeder(fullCard);
      }
      
      console.log(`[Queue update_wedding_card] Hoàn tất update card ID: ${id}`);
    } catch (e) {
      console.error(`[Queue update_wedding_card] Lỗi update card ID: ${id}`, e);
      throw e;
    }
  },
  {
    connection: redisConnection,
    limiter: {
      max: 5,
      duration: 1000,
    },
  }
);

export class WeddingCardService {
  public async getList(event: any) {
    const query = event.context.query || getQuery(event);
    try {
      const result = await WeddingCard.list(query);
      return FormatResponse.success(
        result,
        "Get card template list successfully!",
      );
    } catch (error) {
      return FormatResponse.failure(error);
    }
  }

  public async getDetail(event: any) {
    const id = getRouterParam(event, "id");
    try {
      if (!id) return FormatResponse.error(event, "ID is required!");
      const item = await WeddingCard.getById(id);
      if (!item) return FormatResponse.error(event, "Card template not found!");
      return FormatResponse.success(
        item,
        "Get card template detail successfully!",
      );
    } catch (error) {
      return FormatResponse.failure(error);
    }
  }

  public async getByUrl(event: any) {
    // Check both 'slug' and 'id' because route conflict between [id].put.ts and [slug].get.ts
    // might cause the parameter to be named 'id' even for this GET route.
    const url = getRouterParam(event, "slug") || getRouterParam(event, "id") || event.context.params?.slug || event.context.params?.id;
    console.log("Debug getByUrl: slug param:", url, "params:", event.context.params);
    try {
      if (!url) return FormatResponse.error(event, "URL is required!");
      const item = await WeddingCard.getByUrl(url);
      if (!item) return FormatResponse.error(event, "Card template not found!");
      return FormatResponse.success(
        item,
        "Get card template detail successfully!",
      );
    } catch (error) {
      return FormatResponse.failure(error);
    }
  }

  public async create(event: any) {
    const body = await readBody(event);
    const session = await getUserSession(event);
    const sessionUser = session?.user as any;
    const email = sessionUser?.email;

    let user = null;
    if (email) {
      user = await User.checkUserNormal(email);
    }

    try {
      if (!body.name && !body.url) {
        // If neither name nor url provided, generate a default name
        body.name = "Thiệp cưới của tôi";
      }

      // Handle URL/Slug
      if (!body.url) {
        if (body.name && body.name !== "Thiệp cưới của tôi") {
           // Should check uniqueness also, but for now rely on service or DB constraint
           body.url = services.generateSlug(body.name);
        } else {
           // Generate random slug
           // Using simple timestamp + random for now
           const randomSuffix = Math.floor(Math.random() * 10000);
           body.url = `card-${Date.now()}-${randomSuffix}`;
        }
      }

      // Handle User and Template flag
      // Logic: If request comes from admin API (event.path), assume admin.
      // Or check user role. 
      // Simplified: If user is logged in and not admin specific request, set id_user and is_template=false
      
      // Determine if it should be a template. 
      // Existing logic didn't strict check, but usually admin sets is_template=true.
      // Default to false if not provided.
      if (body.is_template === undefined) {
          body.is_template = false;
      }

      if (user) {
         body.id_user = user.id;
      }
      
      // Flatten properties if they exist
      if (body.properties) {
        if (body.properties.nodes) body.nodes = body.properties.nodes;
        if (body.properties.background) body.background = body.properties.background;
        if (body.properties.height) body.height = body.properties.height;
        if (body.properties.music) body.music = JSON.stringify(body.properties.music);
        if (body.properties.effect) body.effect = typeof body.properties.effect === 'object' ? JSON.stringify(body.properties.effect) : body.properties.effect;
        delete body.properties;
      }

      // Check if URL exists? sequelize unique constraint might throw error.
      // Better to check first?
      const existing = await WeddingCard.getByUrl(body.url);
      if (existing) {
          // If auto-generated, retry? Or just append random.
          body.url = `${body.url}-${Math.floor(Math.random() * 1000)}`;
      }

      const newItem = await WeddingCard.create(body);

      // Export if admin
      if (user && user.role === 'admin') {
         await exportToSeeder(newItem);
      }

      return FormatResponse.success(
        newItem,
        "Card created successfully!",
      );
    } catch (error) {
      return FormatResponse.failure(error);
    }
  }

  public async update(event: any) {
    const id = getRouterParam(event, "id");
    const body = await readBody(event);
    const userOrAdminToken = await this.getAuthenticatedUser(event);

    try {
      if (!id) return FormatResponse.error(event, "ID is required!");

      // Optional: Check permission if user is trying to update someone else's card
      if (userOrAdminToken && userOrAdminToken.role !== 'admin') {
          const currentCard = await WeddingCard.getById(id);
          if (currentCard && currentCard.id_user && currentCard.id_user !== userOrAdminToken.id) {
               return FormatResponse.error(event, "Permission denied!", 403);
          }
      }

      // Flatten properties if they exist
      if (body.properties) {
        if (body.properties.nodes) body.nodes = body.properties.nodes;
        if (body.properties.background) body.background = body.properties.background;
        if (body.properties.height) body.height = body.properties.height;
        if (body.properties.music) body.music = JSON.stringify(body.properties.music);
        if (body.properties.effect) body.effect = typeof body.properties.effect === 'object' ? JSON.stringify(body.properties.effect) : body.properties.effect;
        delete body.properties;
      }

      const isAdmin = userOrAdminToken?.role === 'admin';
      updateQueue.add("update-card", { id, body, isAdmin }).catch(e => {
        console.error("Error adding to updateQueue:", e);
      });

      return FormatResponse.success(
        { id },
        "Tiến trình cập nhật đã được đưa vào hàng đợi!",
      );
    } catch (error) {
      return FormatResponse.failure(error);
    }
  }

  public async like(event: any) {
    const { slug } = await readBody(event);
    if (!slug) return FormatResponse.error(event, "Slug is required!");
    try {
      const card = await WeddingCard.getByUrl(slug);
      if (!card) return FormatResponse.error(event, "Card not found!");

      // Increment likes
      await WeddingCard.update(card.id, {
        likes: (card.likes || 0) + 1
      });

      return FormatResponse.success(true, "Liked successfully!");
    } catch (error) {
      return FormatResponse.failure(error);
    }
  }

  public async view(event: any) {
    const { slug } = await readBody(event);
    if (!slug) return FormatResponse.error(event, "Slug is required!");
    try {
      const card = await WeddingCard.getByUrl(slug);
      if (!card) return FormatResponse.error(event, "Card not found!");

      // Increment views
      await WeddingCard.update(card.id, {
        views: (card.views || 0) + 1
      });

      return FormatResponse.success(true, "Viewed successfully!");
    } catch (error) {
      return FormatResponse.failure(error);
    }
  }

  private async getAuthenticatedUser(event: any) {
    const session = await getUserSession(event);
    const sessionUser = session?.user as any;
    if (sessionUser?.email) {
      return await User.checkUserNormal(sessionUser.email);
    }
    
    // Check admin token cookie
    const config = useRuntimeConfig();
    const token = getCookie(event, "auth_admin_token");
    if (token) {
      try {
        const decoded = jwt.verify(token, config.jwtSecret) as any;
        if (decoded && decoded.id) {
          return await User.getById(decoded.id);
        }
      } catch (e) {}
    }
    return null;
  }

  public async delete(event: any) {
    const id = getRouterParam(event, "id");
    try {
      if (!id) return FormatResponse.error(event, "ID is required!");
      const result = await WeddingCard.delete(id);
      if (!result)
        return FormatResponse.error(
          event,
          "Delete failed or card template not found!",
        );
      return FormatResponse.success(
        true,
        "Card template deleted successfully!",
      );
    } catch (error) {
      return FormatResponse.failure(error);
    }
  }
}
