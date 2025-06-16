import { 
  newsItems, 
  teachers, 
  quickLinks, 
  campusBuildings, 
  settings,
  type NewsItem, 
  type InsertNewsItem,
  type Teacher, 
  type InsertTeacher,
  type QuickLink, 
  type InsertQuickLink,
  type CampusBuilding, 
  type InsertCampusBuilding,
  type Settings, 
  type InsertSettings
} from "@shared/schema";

export interface IStorage {
  // News
  getNewsItems(): Promise<NewsItem[]>;
  getNewsItem(id: number): Promise<NewsItem | undefined>;
  createNewsItem(item: InsertNewsItem): Promise<NewsItem>;
  
  // Teachers
  getTeachers(): Promise<Teacher[]>;
  getTeacher(id: number): Promise<Teacher | undefined>;
  searchTeachers(query: string): Promise<Teacher[]>;
  getTeachersByDepartment(department: string): Promise<Teacher[]>;
  createTeacher(teacher: InsertTeacher): Promise<Teacher>;
  
  // Quick Links
  getQuickLinks(): Promise<QuickLink[]>;
  getQuickLink(id: number): Promise<QuickLink | undefined>;
  createQuickLink(link: InsertQuickLink): Promise<QuickLink>;
  
  // Campus Buildings
  getCampusBuildings(): Promise<CampusBuilding[]>;
  getCampusBuilding(id: number): Promise<CampusBuilding | undefined>;
  createCampusBuilding(building: InsertCampusBuilding): Promise<CampusBuilding>;
  
  // Settings
  getSettings(): Promise<Settings>;
  updateSettings(settings: Partial<InsertSettings>): Promise<Settings>;
}

export class MemStorage implements IStorage {
  private newsItems: Map<number, NewsItem>;
  private teachers: Map<number, Teacher>;
  private quickLinks: Map<number, QuickLink>;
  private campusBuildings: Map<number, CampusBuilding>;
  private settings: Settings;
  private currentId: number;

  constructor() {
    this.newsItems = new Map();
    this.teachers = new Map();
    this.quickLinks = new Map();
    this.campusBuildings = new Map();
    this.currentId = 1;
    
    // Initialize with default settings
    this.settings = {
      id: 1,
      language: "el",
      newsNotifications: true,
      gradesNotifications: true,
      eventsNotifications: false,
      darkMode: false,
    };
    
    this.initializeData();
  }

  private initializeData() {
    // Initialize with sample data for demonstration
    const sampleNews: Omit<NewsItem, 'id'>[] = [
      {
        title: "Έναρξη Νέου Ακαδημαϊκού Έτους 2024-25",
        excerpt: "Ανακοινώνεται η έναρξη των μαθημάτων για το ακαδημαϊκό έτος 2024-25. Οι εγγραφές ξεκινούν την 1η Σεπτεμβρίου.",
        content: "Λεπτομερείες για το νέο ακαδημαϊκό έτος...",
        category: "Ακαδημαϊκά",
        publishedAt: new Date('2024-08-15'),
        isImportant: true
      },
      {
        title: "Σεμινάριο Τεχνητής Νοημοσύνης",
        excerpt: "Διοργανώνεται σεμινάριο για την Τεχνητή Νοημοσύνη στις 20 Σεπτεμβρίου. Συμμετοχή δωρεάν για φοιτητές.",
        content: "Το σεμινάριο θα καλύψει...",
        category: "Εκδηλώσεις",
        publishedAt: new Date('2024-09-01'),
        isImportant: false
      },
      {
        title: "Διακρίσεις Φοιτητών στον Διαγωνισμό Προγραμματισμού",
        excerpt: "Φοιτητές του τμήματος κατέκτησαν την πρώτη θέση στον πανελλήνιο διαγωνισμό προγραμματισμού.",
        content: "Συγχαρητήρια στους φοιτητές...",
        category: "Επιτυχίες",
        publishedAt: new Date('2024-08-28'),
        isImportant: true
      }
    ];

    const sampleTeachers: Omit<Teacher, 'id'>[] = [
      {
        name: "Δρ. Μαρία Παπαδάκη",
        email: "mpapadaki@hmu.gr",
        department: "Πληροφορική",
        specialization: "Τεχνητή Νοημοσύνη, Μηχανική Μάθηση",
        office: "Α201",
        phone: "2810-379800",
        websiteUrl: "https://cs.hmu.gr/mpapadaki"
      },
      {
        name: "Καθ. Νίκος Αντωνίου",
        email: "nantoniou@hmu.gr",
        department: "Πληροφορική",
        specialization: "Αλγόριθμοι, Δομές Δεδομένων",
        office: "Α305",
        phone: "2810-379810",
        websiteUrl: "https://cs.hmu.gr/nantoniou"
      },
      {
        name: "Δρ. Κατερίνα Σπανού",
        email: "kspannou@hmu.gr",
        department: "Μαθηματικά",
        specialization: "Στατιστική, Θεωρία Πιθανοτήτων",
        office: "Β120",
        phone: "2810-379820",
        websiteUrl: null
      }
    ];

    const sampleLinks: Omit<QuickLink, 'id'>[] = [
      {
        title: "Φοιτητική Πύλη",
        description: "Πρόσβαση σε βαθμολογίες, δηλώσεις μαθημάτων",
        url: "https://student.hmu.gr",
        icon: "GraduationCap",
        color: "bg-primary",
        isExternal: true
      },
      {
        title: "Εύδοξος",
        description: "Σύστημα διάθεσης συγγραμμάτων",
        url: "https://eudoxus.gr",
        icon: "BookOpen",
        color: "bg-green-500",
        isExternal: true
      },
      {
        title: "Webmail ΗΜΥ",
        description: "Πρόσβαση στο email του πανεπιστημίου",
        url: "https://webmail.hmu.gr",
        icon: "Mail",
        color: "bg-orange-500",
        isExternal: true
      },
      {
        title: "Πρόγραμμα Μαθημάτων",
        description: "Ωρολόγιο πρόγραμμα και αίθουσες",
        url: "https://ee.hmu.gr/courses",
        icon: "Calendar",
        color: "bg-purple-500",
        isExternal: true
      },
      {
        title: "Βιβλιοθήκη",
        description: "Αναζήτηση βιβλίων και ψηφιακό υλικό",
        url: "https://library.hmu.gr",
        icon: "Library",
        color: "bg-blue-500",
        isExternal: true
      }
    ];

    const sampleBuildings: Omit<CampusBuilding, 'id'>[] = [
      {
        name: "Κεντρικό Κτίριο",
        description: "Διοίκηση, Γραμματεία, Αμφιθέατρα",
        latitude: "35.3027",
        longitude: "25.0709",
        buildingType: "main",
        facilities: ["Γραμματεία", "Αμφιθέατρα", "Καφετέρια"]
      },
      {
        name: "Εργαστήρια Πληροφορικής",
        description: "Εργαστήρια Η/Υ, Δίκτυα, Προγραμματισμός",
        latitude: "35.3030",
        longitude: "25.0715",
        buildingType: "lab",
        facilities: ["Εργαστήρια Η/Υ", "Δίκτυα", "Σέρβερ"]
      },
      {
        name: "Βιβλιοθήκη",
        description: "Κεντρική Βιβλιοθήκη και Αναγνωστήρια",
        latitude: "35.3025",
        longitude: "25.0720",
        buildingType: "library",
        facilities: ["Αναγνωστήρια", "Ψηφιακή Βιβλιοθήκη", "Μελέτη"]
      }
    ];

    // Add sample data to storage
    sampleNews.forEach((newsItem, index) => {
      const id = this.currentId++;
      this.newsItems.set(id, { ...newsItem, id });
    });

    sampleTeachers.forEach((teacher, index) => {
      const id = this.currentId++;
      this.teachers.set(id, { ...teacher, id });
    });

    sampleLinks.forEach((link, index) => {
      const id = this.currentId++;
      this.quickLinks.set(id, { ...link, id });
    });

    sampleBuildings.forEach((building, index) => {
      const id = this.currentId++;
      this.campusBuildings.set(id, { ...building, id });
    });
  }

  // News methods
  async getNewsItems(): Promise<NewsItem[]> {
    return Array.from(this.newsItems.values()).sort((a, b) => 
      new Date(b.publishedAt).getTime() - new Date(a.publishedAt).getTime()
    );
  }

  async getNewsItem(id: number): Promise<NewsItem | undefined> {
    return this.newsItems.get(id);
  }

  async createNewsItem(insertItem: InsertNewsItem): Promise<NewsItem> {
    const id = this.currentId++;
    const item: NewsItem = { ...insertItem, id };
    this.newsItems.set(id, item);
    return item;
  }

  // Teachers methods
  async getTeachers(): Promise<Teacher[]> {
    return Array.from(this.teachers.values()).sort((a, b) => a.name.localeCompare(b.name));
  }

  async getTeacher(id: number): Promise<Teacher | undefined> {
    return this.teachers.get(id);
  }

  async searchTeachers(query: string): Promise<Teacher[]> {
    const teachers = Array.from(this.teachers.values());
    const lowercaseQuery = query.toLowerCase();
    return teachers.filter(teacher => 
      teacher.name.toLowerCase().includes(lowercaseQuery) ||
      teacher.department.toLowerCase().includes(lowercaseQuery) ||
      teacher.specialization?.toLowerCase().includes(lowercaseQuery)
    );
  }

  async getTeachersByDepartment(department: string): Promise<Teacher[]> {
    return Array.from(this.teachers.values()).filter(teacher => 
      teacher.department === department
    );
  }

  async createTeacher(insertTeacher: InsertTeacher): Promise<Teacher> {
    const id = this.currentId++;
    const teacher: Teacher = { ...insertTeacher, id };
    this.teachers.set(id, teacher);
    return teacher;
  }

  // Quick Links methods
  async getQuickLinks(): Promise<QuickLink[]> {
    return Array.from(this.quickLinks.values());
  }

  async getQuickLink(id: number): Promise<QuickLink | undefined> {
    return this.quickLinks.get(id);
  }

  async createQuickLink(insertLink: InsertQuickLink): Promise<QuickLink> {
    const id = this.currentId++;
    const link: QuickLink = { ...insertLink, id };
    this.quickLinks.set(id, link);
    return link;
  }

  // Campus Buildings methods
  async getCampusBuildings(): Promise<CampusBuilding[]> {
    return Array.from(this.campusBuildings.values());
  }

  async getCampusBuilding(id: number): Promise<CampusBuilding | undefined> {
    return this.campusBuildings.get(id);
  }

  async createCampusBuilding(insertBuilding: InsertCampusBuilding): Promise<CampusBuilding> {
    const id = this.currentId++;
    const building: CampusBuilding = { ...insertBuilding, id };
    this.campusBuildings.set(id, building);
    return building;
  }

  // Settings methods
  async getSettings(): Promise<Settings> {
    return this.settings;
  }

  async updateSettings(updateSettings: Partial<InsertSettings>): Promise<Settings> {
    this.settings = { ...this.settings, ...updateSettings };
    return this.settings;
  }
}

export const storage = new MemStorage();
