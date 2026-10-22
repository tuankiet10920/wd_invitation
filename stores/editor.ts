import { defineStore } from "pinia";
import { nextTick } from "vue";
import { useElementStore } from "~~/stores/element";
import { v4 as uuidv4 } from "uuid";
import type { Role } from "~~/interfaces";
import { toPng } from "html-to-image";

interface NodeInterface {
  id: number;
  type: string;
  styles: Record<string, any>;
  props?: Record<string, any>;
}

interface CardData {
  id: string;
  id_category_wedding_card?: number | null;
  is_publish?: boolean;
  is_template?: boolean;
  is_template_user?: boolean;
  id_package?: number | null;
  createdAt?: string | null;
  package_time_save_card?: number | null;
  avatar?: string | null;
  properties: {
    nodes: NodeInterface[];
    background: string;
    height?: number;
    music?: {
      icon: string;
      color: string;
      path: string;
    };
    effect?: any;
  };
}

export const useEditorStore = defineStore("editor", {
  state: () => ({
    activeMenu: null as string | null,
    createdNodes: [] as NodeInterface[],
    currentTarget: null as HTMLElement | null,
    selectedNodeId: null as number | null,
    selectedNodeIds: [] as number[],
    paperPageRef: null as HTMLElement | null,
    isEditing: false,
    background: "#ffffff" as string,
    height: 1024 as number,
    currentCardId: null as string | null,
    id_category_wedding_card: null as number | null,
    is_publish: true as boolean,
    is_template: false as boolean,
    is_template_user: false as boolean,
    id_package: null as number | null,
    createdAt: null as string | null,
    package_time_save_card: null as number | null,
    avatar: null as string | null,
    avatarCacheBuster: Date.now() as number,
    role: null as Role | null,
    music: {
      icon: "music-circle-outline",
      color: "#000000",
      path: "",
    } as { icon: string; color: string; path: string },
    effect: {
      dynamic: "none",
      falling: "none",
      opening: {
        isCustom: false,
        slug: "none",
        custom: {
          title: "",
          subtitle: "",
          time: 0,
          image: "",
        },
      },
    } as any,
    rawMusicTypes: [] as any[],
    rawMusics: [] as any[],
    isFetchingMusics: false as boolean,
    rawPersonalMusics: [] as any[],
    isFetchingPersonalMusics: false as boolean,
    categoryError: false as boolean,
    // History system
    history: [] as string[],
    historyIndex: -1 as number,
    isUndoingRedoing: false as boolean,
    isReplacingImage: false as boolean,
    zoom: 1 as number,
    auto_save: true as boolean,
    is_saved: true as boolean,
    isSaving: false as boolean,
    autoSaveTimer: null as any,
    showSettingModal: false as boolean,
    isPreviewMode: false as boolean,
    notification: {
      show: false as boolean,
      message: "" as string,
      type: "success" as "success" | "error" | "warning",
    },
  }),
  getters: {
    selectedNode: (state) =>
      state.createdNodes.find((n) => n.id === state.selectedNodeId),
    selectedNodes: (state) =>
      state.createdNodes.filter((n) => state.selectedNodeIds.includes(n.id)),
    canUndo: (state) => state.historyIndex > 0,
    canRedo: (state) => state.historyIndex < state.history.length - 1,
  },
  actions: {
    showNotification(message: string, type: "success" | "error" | "warning" = "success") {
      if (!this.notification) {
        this.notification = {
          show: false,
          message: "",
          type: "success"
        };
      }
      this.notification.show = true;
      this.notification.message = message;
      this.notification.type = type;

      // Auto close after 3 seconds
      setTimeout(() => {
        if (this.notification && this.notification.message === message) {
          this.notification.show = false;
        }
      }, 3000);
    },

    getSnapshot() {
      return JSON.stringify({
        nodes: this.createdNodes,
        background: this.background,
        height: this.height,
        effect: this.effect,
        music: this.music,
        is_publish: this.is_publish,
        id_package: this.id_package,
      });
    },

    recordHistory() {
      if (this.isUndoingRedoing) return;

      const snapshot = this.getSnapshot();

      // Don't record if it's the same as the current history point
      if (
        this.historyIndex >= 0 &&
        this.history[this.historyIndex] === snapshot
      )
        return;

      // Remove any future history if we are in the middle of the stack
      if (this.historyIndex < this.history.length - 1) {
        this.history = this.history.slice(0, this.historyIndex + 1);
      }

      this.history.push(snapshot);
      this.historyIndex++;

      // Limit history size (e.g. 50 steps)
      if (this.history.length > 50) {
        this.history.shift();
        this.historyIndex--;
      }
    },

    undo() {
      if (!this.canUndo) return;

      this.isUndoingRedoing = true;
      this.historyIndex--;
      this.applySnapshot(this.history[this.historyIndex]!);
      this.isUndoingRedoing = false;
    },

    redo() {
      if (!this.canRedo) return;

      this.isUndoingRedoing = true;
      this.historyIndex++;
      this.applySnapshot(this.history[this.historyIndex]!);
      this.isUndoingRedoing = false;
    },

    applySnapshot(snapshot: string) {
      try {
        const data = JSON.parse(snapshot);
        this.createdNodes = data.nodes;
        this.background = data.background;
        this.height = data.height;
        this.effect = data.effect;
        this.music = data.music;
        this.is_publish = data.is_publish;
        this.id_package = data.id_package;
      } catch (e) {
        console.error("Failed to apply history snapshot", e);
      }
    },

    initSettings() {
      if (import.meta.server) return;

      const autoSave = localStorage.getItem("auto_save");
      if (autoSave === null) {
        this.auto_save = true;
        localStorage.setItem("auto_save", "true");
      } else {
        this.auto_save = autoSave === "true";
      }

      const isSaved = localStorage.getItem("is_saved");
      if (isSaved === null) {
        this.is_saved = true;
        localStorage.setItem("is_saved", "true");
      } else {
        this.is_saved = isSaved === "true";
      }
    },

    // Load state from localStorage on init
    init() {
      this.initSettings();
      const saved = localStorage.getItem("wd_invitations");
      let allCards: CardData[] = [];

      if (saved) {
        try {
          allCards = JSON.parse(saved);
        } catch (e) {
          console.error("Failed to load invitations", e);
        }
      }

      const defaultMusic = {
        icon: "music-circle-outline",
        color: "#000000",
        path: "",
      };

      if (allCards.length > 0) {
        // Load the first card for now
        const card = allCards[0]!;
        this.currentCardId = card.id;
        this.id_category_wedding_card = card.id_category_wedding_card || null;
        this.is_publish =
          card.is_publish !== undefined ? card.is_publish : true;
        this.is_template = card.is_template || false;
        this.is_template_user = card.is_template_user || false;
        this.id_package = card.id_package || null;
        this.createdAt = card.createdAt || null;
        this.package_time_save_card = card.package_time_save_card || null;
        this.avatar = card.avatar || null;
        this.createdNodes = card.properties.nodes || [];
        this.background = card.properties.background || "#ffffff";
        this.height = card.properties.height || 1024;

        const defaultEffect = {
          dynamic: "none",
          falling: "none",
          opening: {
            isCustom: false,
            slug: "none",
            custom: { title: "", subtitle: "", time: 0, image: "" },
          },
        };

        const savedEffect = card.properties.effect;
        if (typeof savedEffect === "string") {
          this.effect = { ...defaultEffect, dynamic: savedEffect };
        } else if (savedEffect) {
          // Merge deep for opening
          this.effect = {
            ...defaultEffect,
            ...(savedEffect as any),
            opening: {
              ...defaultEffect.opening,
              ...((savedEffect as any).opening || {}),
            },
          };
        } else {
          this.effect = defaultEffect;
        }

        const savedMusic: any = card.properties.music || {};

        // Merge saved music with defaults to ensure all fields exist
        this.music = {
          icon: savedMusic.icon || defaultMusic.icon,
          color: savedMusic.color || defaultMusic.color,
          path: savedMusic.path || defaultMusic.path,
        };
      } else {
        // Create new card
        const newId = uuidv4();
        this.currentCardId = newId;
        this.id_category_wedding_card = null;
        this.is_publish = true;
        this.is_template = false;
        this.is_template_user = false;
        this.id_package = null;
        this.avatar = null;
        this.createdNodes = [];
        this.background = "#ffffff";
        this.height = 1024;
        this.effect = {
          dynamic: "none",
          falling: "none",
          opening: {
            isCustom: false,
            slug: "none",
            custom: { title: "", subtitle: "", time: 0, image: "" },
          },
        };
        this.music = { ...defaultMusic };

        // Không chủ động push vào localStorage ở đây nữa để tránh dư thừa,
        // để cơ chế subscribe tự lo khi có sự thay đổi thực sự
      }

      // Initial record
      this.recordHistory();

      this.setupAutoSaveInterval();

      // Khởi tạo chuỗi dữ liệu gốc để so sánh, tránh việc subscribe bị trigger lưu bản nháp ngay khi vừa mở trang (do lastSaveDataStr = "")
      const initialDataStr = this.getSnapshot();
      this.startHistorySync(initialDataStr);
    },

    setupAutoSaveInterval() {
      if (import.meta.server) return;

      if (this.autoSaveTimer) clearInterval(this.autoSaveTimer);

      this.autoSaveTimer = setInterval(async () => {
        if (this.auto_save && !this.is_saved && !this.isSaving) {
          console.log("Auto-saving to server...");
          await this.saveCard(true);
        }
      }, 30000); // 30 seconds
    },

    startHistorySync(initialDataStr: string) {
      // Watch for changes to save
      let debounceTimer: NodeJS.Timeout | null = null;
      let lastSaveDataStr = initialDataStr;

      this.$subscribe(
        (mutation: any, state: any) => {
          // Ignore UI state mutations to avoid saving when just clicking elements
          const ignoreEvents = [
            "activeMenu",
            "currentTarget",
            "selectedNodeId",
            "selectedNodeIds",
            "paperPageRef",
            "isEditing",
            "historyIndex",
            "history",
            "isUndoingRedoing",
          ];
          if (mutation.events && !Array.isArray(mutation.events)) {
            if (ignoreEvents.includes(mutation.events.key)) return;
          } else if (Array.isArray(mutation.events)) {
            const allIgnored = mutation.events.every((e: any) =>
              ignoreEvents.includes(e.key),
            );
            if (allIgnored) return;
          }

          // Check if data actually changed before triggering save
          const currentDataStr = this.getSnapshot();

          if (currentDataStr === lastSaveDataStr) return;

          // Mark as unsaved
          this.is_saved = false;
          localStorage.setItem("is_saved", "false");

          // Record history for changes
          this.recordHistory();

          if (debounceTimer) clearTimeout(debounceTimer);

          debounceTimer = setTimeout(() => {
            lastSaveDataStr = currentDataStr; // mark as saved

            // LƯU RA LOCAL STORAGE LÀM BẢN NHÁP KHI ĐANG CHỈNH SỬA
            console.log("Saving draft to LocalStorage...", {
              currentCardId: state.currentCardId,
            });
            const savedRaw = localStorage.getItem("wd_invitations");
            const cards: CardData[] = savedRaw ? JSON.parse(savedRaw) : [];

            if (state.currentCardId) {
              const index = cards.findIndex(
                (c) => c.id === state.currentCardId,
              );
              const cardData = {
                id: state.currentCardId,
                id_category_wedding_card: state.id_category_wedding_card,
                is_publish: state.is_publish,
                is_template: state.is_template,
                is_template_user: state.is_template_user,
                id_package: state.id_package,
                createdAt: state.createdAt,
                package_time_save_card: state.package_time_save_card,
                avatar: state.avatar,
                properties: {
                  nodes: state.createdNodes,
                  background: state.background,
                  height: state.height,
                  effect: state.effect,
                  music: state.music,
                },
              };

              if (index !== -1) {
                cards[index] = cardData;
              } else {
                cards.push(cardData);
              }

              localStorage.setItem("wd_invitations", JSON.stringify(cards));
            }
          }, 5000); // Debounce 5s đợi ngừng thao tác
        },
        { detached: true },
      );
    },

    async fetchPublicMusics() {
      if (this.rawMusics.length > 0 || this.isFetchingMusics) return; // Prevent multiple calls
      this.isFetchingMusics = true;
      try {
        const res: any = await $fetch("/api/v1/client/musics");
        if (res && res.data) {
          this.rawMusicTypes = res.data.types || [];
          this.rawMusics = res.data.musics || [];
        }
      } catch (e) {
        console.error("Failed to fetch musics", e);
      } finally {
        this.isFetchingMusics = false;
      }
    },

    async fetchPersonalMusics() {
      if (this.rawPersonalMusics.length > 0 || this.isFetchingPersonalMusics)
        return;
      this.isFetchingPersonalMusics = true;
      try {
        const res: any = await $fetch("/api/v1/client/musics/personal");
        if (res && res.data) {
          this.rawPersonalMusics = res.data || [];
        }
      } catch (e) {
        console.error("Failed to fetch personal musics", e);
      } finally {
        this.isFetchingPersonalMusics = false;
      }
    },

    calculateViewportOffset(): number {
      if (!this.paperPageRef) return 150;
      const scrollContainer = this.paperPageRef.closest(".draw-canvas");
      if (!scrollContainer) return 150;

      const containerRect = scrollContainer.getBoundingClientRect();
      const paperRect = this.paperPageRef.getBoundingClientRect();

      let topOffset = containerRect.top - paperRect.top + 100;

      // Đảm bảo không bị âm (nhảy ra ngoài phía trên)
      if (topOffset < 20) topOffset = 150;
      return topOffset;
    },

    addNode(type: string, { props = {}, styles = {} }: any = {}) {
      const newStyles = { ...styles };

      // Nếu 'top' không được truyền vào, tính toán dựa trên vị trí cuộn hiện tại
      if (!newStyles.top) {
        newStyles.top = `${this.calculateViewportOffset()}px`;
      }

      // Mặc định căn giữa nếu không có tọa độ ngang
      if (!newStyles.left) {
        const nodeWidth = parseFloat(newStyles.width) || 0;
        // Giả sử chiều rộng giấy là 500px
        const paperWidth = 500;
        const leftOffset = (paperWidth - nodeWidth) / 2;
        newStyles.left = `${leftOffset}px`;
      }

      const newNodeId = Date.now();
      this.createdNodes.push({
        id: newNodeId,
        type,
        styles: newStyles,
        props: props || {},
      });

      this.selectedNodeId = newNodeId;
      this.selectedNodeIds = [newNodeId];
      useElementStore().type = type;

      if (typeof window !== "undefined") {
        nextTick(() => {
          const el = document.querySelector(
            `[data-id="${newNodeId}"]`
          ) as HTMLElement | null;
          if (el) {
            this.currentTarget = el;
          }
        });
      }
    },

    selectElement(e: MouseEvent) {
      if (this.isEditing) return; // Không chọn target mới khi đang gõ chữ

      const el = e.target as HTMLElement;
      // Tìm phần tử gần nhất có class .editable
      const target = el.closest(".editable") as HTMLElement | null;
      this.currentTarget = target;

      if (!target) {
        if (el && el.classList && el.classList.contains("paper-page")) {
          useElementStore().type = "Setup";
          this.selectedNodeId = null;
          this.selectedNodeIds = [];
          this.currentTarget = null;
        }
      } else {
        // Extract ID from date-id attribute
        const id = target.getAttribute("data-id");
        if (id) {
          const nodeId = Number(id);
          this.selectedNodeId = nodeId;
          // If not already in multi-selection, set multi-selection to just this node
          if (!this.selectedNodeIds.includes(nodeId)) {
            this.selectedNodeIds = [nodeId];
          }

          // Đồng bộ kiểu phần tử sang element store để mở tab công cụ tương ứng
          const node = this.createdNodes.find((n) => n.id === nodeId);
          if (node) {
            useElementStore().type = node.type;
          }
        }
      }
    },

    setSelectedNodeIds(ids: number[]) {
      this.selectedNodeIds = ids;
      if (ids.length === 1) {
        this.selectedNodeId = ids[0]!;
      } else if (ids.length === 0) {
        this.selectedNodeId = null;
      } else {
        // When multiple are selected, primary ID could be the first one
        this.selectedNodeId = ids[0]!;
      }
    },

    updateNodeStyle(id: number, styles: Record<string, any>) {
      const node = this.createdNodes.find((n) => n.id === id);
      if (node) {
        node.styles = { ...node.styles, ...styles };
      }
    },

    async loadFromSlug(slug: string) {
      if (slug === "new-blank") {
        // Initialize blank state
        this.currentCardId = uuidv4(); // Generate temp ID for LocalStorage
        this.id_category_wedding_card = null;
        this.is_publish = true;
        this.is_template = false;
        this.is_template_user = false;
        this.id_package = null;
        this.createdAt = new Date().toISOString();
        this.package_time_save_card = null;
        this.avatar = "/others/cinelove-default-thumbnail.jpg";
        this.createdNodes = [];
        this.background = "#ffffff";
        this.height = 1024;
        this.effect = {
          dynamic: "none",
          falling: "none",
          opening: {
            isCustom: false,
            slug: "none",
            custom: { title: "", subtitle: "", time: 0, image: "" },
          },
        };
        this.music = {
          icon: "music-circle-outline",
          color: "#000000",
          path: "",
        };
        this.isEditing = false; // Start in selection mode, not text edit mode

        // Ngay khi chủ động tạo new-blank, lưu luôn thẳng 1 file nháp chính thức vào Storage
        // để khi check list hoặc f5 thì vẫn thấy bản nháp duy nhất được tạo cho lần này
        const savedRaw = localStorage.getItem("wd_invitations");
        const cards: CardData[] = savedRaw ? JSON.parse(savedRaw) : [];
        cards.push({
          id: this.currentCardId as string,
          id_category_wedding_card: this.id_category_wedding_card,
          is_publish: this.is_publish,
          is_template: this.is_template,
          is_template_user: this.is_template_user,
          id_package: this.id_package,
          createdAt: this.createdAt,
          package_time_save_card: this.package_time_save_card,
          avatar: this.avatar,
          properties: {
            nodes: this.createdNodes,
            background: this.background,
            height: this.height,
            effect: this.effect,
            music: this.music,
          },
        });
        localStorage.setItem("wd_invitations", JSON.stringify(cards));

        return;
      }

      try {
        const data: any = await $fetch(`/api/v1/client/card-template/${slug}`);
        if (data && data.data) {
          const card = data.data;
          this.currentCardId = card.id;

          // Parse properties if it's a string, otherwise use as object
          let properties = card.properties;
          const robustParse = (val: any) => {
            let res = val;
            while (
              typeof res === "string" &&
              (res.startsWith("{") ||
                res.startsWith("[") ||
                res.startsWith('"'))
            ) {
              try {
                const parsed = JSON.parse(res);
                if (parsed === res) break;
                res = parsed;
              } catch (e) {
                break;
              }
            }
            return res;
          };

          if (typeof properties === "string") {
            properties = robustParse(properties);
          } else if (!properties) {
            // Compatibility with backend flattening
            properties = {
              nodes: robustParse(card.nodes),
              background: card.background,
              height: card.height || 1024,
              effect: robustParse(card.effect) || "none",
              music: robustParse(card.music),
            };
          }

          this.createdNodes = robustParse(properties.nodes) || [];
          this.background = properties.background || "#ffffff";
          this.height = properties.height || 1024;

          const defaultEffect = {
            dynamic: "none",
            falling: "none",
            opening: {
              isCustom: false,
              slug: "none",
              custom: { title: "", subtitle: "", time: 0, image: "" },
            },
          };

          const savedEffect = robustParse(properties.effect);
          if (typeof savedEffect === "string") {
            this.effect = { ...defaultEffect, dynamic: savedEffect };
          } else if (savedEffect) {
            this.effect = {
              ...defaultEffect,
              ...(savedEffect as any),
              opening: {
                ...defaultEffect.opening,
                ...((savedEffect as any).opening || {}),
              },
            };
          } else {
            this.effect = defaultEffect;
          }

          const defaultMusic = {
            icon: "music-circle-outline",
            color: "#000000",
            path: "",
          };

          const savedMusic = robustParse(properties.music) || {};
          this.music = {
            icon: savedMusic.icon || defaultMusic.icon,
            color: savedMusic.color || defaultMusic.color,
            path: savedMusic.path || defaultMusic.path,
          };

          // Ensure we are NOT in editing mode (Text editing) so we can select elements
          this.isEditing = false;
          this.id_category_wedding_card = card.id_category_wedding_card || null;
          this.is_publish =
            card.is_publish !== undefined ? card.is_publish : true;
          this.is_template = card.is_template || false;
          this.is_template_user = card.is_template_user || false;
          this.id_package = card.id_package || null;
          this.createdAt = card.createdAt || null;
          this.package_time_save_card =
            card.user?.package?.time_save_card || null;
          this.avatar = card.avatar || null;
          this.initSettings();
          this.recordHistory();
          this.startHistorySync(this.getSnapshot());
          this.setupAutoSaveInterval();
        }
      } catch (error) {
        console.error("Failed to load template from slug", error);
      }
    },

    updateNodeProps(id: number, props: Record<string, any>) {
      const node = this.createdNodes.find((n) => n.id === id);
      if (node) {
        node.props = { ...node.props, ...props };
        this.recordHistory();
      }
    },

    startEditingText(targetEl?: HTMLElement | null) {
      if (this.isPreviewMode) return;
      const el = targetEl || (Array.isArray(this.currentTarget) ? this.currentTarget[0] : this.currentTarget) as HTMLElement | null;
      if (!el) return;

      const editableEl = (el.classList.contains('editable') ? el : el.closest('.editable')) as HTMLElement | null;
      if (!editableEl || editableEl.getAttribute('data-type') !== 'Text') return;

      this.isEditing = true;
      editableEl.contentEditable = "true";

      nextTick(() => {
        editableEl.focus();
        try {
          const selection = window.getSelection();
          const range = document.createRange();
          range.selectNodeContents(editableEl);
          if (editableEl.innerText !== 'Double click to edit') {
            range.collapse(false);
          }
          selection?.removeAllRanges();
          selection?.addRange(range);
        } catch (err) {
          console.warn('Could not set cursor position', err);
        }
      });
    },

    endEditingText(targetEl?: HTMLElement | null) {
      const el = targetEl || (Array.isArray(this.currentTarget) ? this.currentTarget[0] : this.currentTarget) as HTMLElement | null;
      if (el) {
        const editableEl = (el.classList.contains('editable') ? el : el.closest('.editable')) as HTMLElement | null;
        if (editableEl && editableEl.getAttribute('data-type') === 'Text') {
          const id = editableEl.getAttribute('data-id');
          if (id) {
            this.updateNodeProps(Number(id), { content: editableEl.innerText });
          }
          editableEl.contentEditable = "false";
        }
      }
      setTimeout(() => {
        this.isEditing = false;
        if (el && (!this.currentTarget || this.currentTarget === el)) {
          this.currentTarget = el;
        }
      }, 50);
    },

    async saveCard(silent = false) {
      if (this.isSaving) return;
      this.isSaving = true;
      const route = useRoute();
      const router = useRouter();

      // Validate Category
      if (!this.id_category_wedding_card) {
        if (!silent) {
          this.categoryError = true;
          // this.activeMenu = "Setup"; // Tự bật tab Cài đặt
          this.showNotification(
            "Bạn chưa chọn danh mục! Vui lòng chọn danh mục để có thể lưu trang.",
            "warning"
          );
        }
        this.isSaving = false;
        return; // Dừng tiến trình
      }
      this.categoryError = false;

      // Collect data
      const payload: any = {
        avatar: this.avatar,
        properties: {
          nodes: this.createdNodes,
          background: this.background,
          height: this.height,
          effect: this.effect,
          music: this.music,
        },
        id_category_wedding_card: this.id_category_wedding_card,
        is_publish: this.is_publish,
        is_template: this.is_template,
        is_template_user: this.is_template_user,
        id_package: this.id_package,
      };

      // Determine API Base URL
      const apiBase =
        this.role === "admin"
          ? "/api/v1/admin/card-templates"
          : "/api/v1/client/card-template";

      try {
        // Check if it's a Draft (string ID) or New (null)
        const isDraft =
          !this.currentCardId || typeof this.currentCardId === "string";
        let savedCardId = this.currentCardId;

        if (isDraft) {
          // Create New
          const data: any = await $fetch(apiBase, {
            method: "POST",
            body: payload,
          });
          if (data && data.data) {
            const oldId = this.currentCardId;
            this.currentCardId = data.data.id;
            savedCardId = data.data.id;

            // Xóa bản nháp khỏi LocalStorage sau khi đã xuất bản thành công
            const savedRaw = localStorage.getItem("wd_invitations");
            if (savedRaw) {
              try {
                const cards = JSON.parse(savedRaw);
                const filteredCards = cards.filter((c: any) => c.id !== oldId);
                localStorage.setItem(
                  "wd_invitations",
                  JSON.stringify(filteredCards),
                );
              } catch (e) {
                console.log(e);
              }
            }

            if (!silent) this.showNotification("Xuất bản thành công!", "success");

            // Update URL without reload
            const isMobile = route.path.includes("/editor/m");
            const targetSlug = data.data.url || data.data.id;

            if (this.role === "admin") {
              router.push(`/admin/editor/${targetSlug}`);
            } else if (route.params.slug === "new-blank") {
              router.push(`/dashboard/pages/${targetSlug}`);
            } else {
              const prefix = isMobile ? "/editor/m" : "/editor";
              router.push(`${prefix}/${targetSlug}`);
            }
            this.is_saved = true;
            localStorage.setItem("is_saved", "true");
            return data.data;
          }
        } else {
          // Update Existing
          await $fetch(`${apiBase}/${this.currentCardId}`, {
            method: "PUT",
            body: payload,
          });

          // Xóa bản nháp khỏi LocalStorage sau khi đã lưu lại lên server thành công
          const savedRaw = localStorage.getItem("wd_invitations");
          if (savedRaw) {
            try {
              const cards = JSON.parse(savedRaw);
              const filteredCards = cards.filter(
                (c: any) => c.id !== this.currentCardId,
              );
              localStorage.setItem(
                "wd_invitations",
                JSON.stringify(filteredCards),
              );
            } catch (e) {
              console.log(e);
            }
          }

          if (!silent) this.showNotification("Cập nhật thành công", "success");
        }

        // Mark as saved
        this.is_saved = true;
        localStorage.setItem("is_saved", "true");

        // --- Auto Generate Image ---
        console.log("this.paperPageRef: ", this.paperPageRef);
        if (this.paperPageRef) {
          try {
            // Slight delay to ensure DOM is updated/stable
            await new Promise((resolve) => setTimeout(resolve, 500));

            await this.ensureImagesLoaded(this.paperPageRef);

            const dataUrl = await toPng(this.paperPageRef, {
              quality: 0.95,
              cacheBust: true, // Tránh lỗi cache ảnh từ CDN
              pixelRatio: 1, // GIẢM TỈ LỆ PIXEL: Tránh lỗi vượt quá giới hạn 4096px-8192px của thẻ Canvas trên trình duyệt gây tình trạng ảnh bị cắt đứt 1 phần
              style: {
                transform: "scale(1)",
              },
              filter: (node) => {
                const exclusionClasses = [
                  "music-badge",
                  "action-toolbar-container",
                  "exclude-export",
                ];
                return !exclusionClasses.some((classname) =>
                  node.classList?.contains(classname),
                );
              },
            });
            const res: any = await $fetch("/api/v1/client/file/upload-base64", {
              method: "POST",
              body: {
                image: dataUrl,
                filename: `IMAGE_WEDDING_CARD_${savedCardId}`,
              },
            });
            console.log("Auto-generated image saved:", res);
            if (res && res.success && res.path) {
              // Update avatar state with timestamp to bust browser cache
              // this.avatar = res.path;
            }
          } catch (imgError) {
            console.error("Failed to auto-generate image:", imgError);
          }
        }
        return { id: savedCardId, url: route.params.slug };
      } catch (error) {
        console.error("Failed to save card", error);
        if (!silent) this.showNotification("Lưu thất bại! Vui lòng thử lại.", "error");
      } finally {
        this.isSaving = false;
      }
    },

    async ensureImagesLoaded(el: HTMLElement): Promise<void> {
      const imgs = Array.from(el.querySelectorAll("img"));
      console.log("imgs: ", imgs);

      const promises = imgs.map((img) => {
        // Nếu ảnh đã load xong rồi thì thôi
        if (img.complete && img.naturalHeight !== 0) return Promise.resolve();

        return new Promise((resolve, reject) => {
          img.onload = resolve;
          img.onerror = (err) => {
            console.error("Lỗi load ảnh khi tạo PNG:", img.src);
            resolve(null); // Vẫn resolve để không chặn đứng cả quá trình
          };
        });
      });
      await Promise.all(promises);
    },

    // Alias for compatibility if needed, or remove
    async saveTemplate() {
      return this.saveCard();
    },
  },
});
