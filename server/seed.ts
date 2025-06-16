import { db } from "./db";
import { newsItems, teachers, quickLinks, campusBuildings, settings } from "@shared/schema";

export async function seedDatabase() {
  try {
    // Check if data already exists
    const existingNews = await db.select().from(newsItems).limit(1);
    if (existingNews.length > 0) {
      console.log("Database already seeded, skipping...");
      return;
    }

    console.log("Seeding database with initial data...");

    // Seed news items
    await db.insert(newsItems).values([
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
    ]);

    // Seed teachers
    await db.insert(teachers).values([
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
    ]);

    // Seed quick links
    await db.insert(quickLinks).values([
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
    ]);

    // Seed campus buildings
    await db.insert(campusBuildings).values([
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
    ]);

    // Seed default settings
    await db.insert(settings).values({
      language: "el",
      newsNotifications: true,
      gradesNotifications: true,
      eventsNotifications: false,
      darkMode: false,
    });

    console.log("Database seeded successfully!");
  } catch (error) {
    console.error("Error seeding database:", error);
    throw error;
  }
}