using Docu_Verify.Api.Models;

namespace Docu_Verify.Api.Data;

public static class DbInitializer
{
    public static void Initialize(AppDbContext context)
    {
        // Look for any existing data.
        if (context.Processes.Any())
        {
            return;   // DB has been seeded
        }

        var states = new State[]
        {
            new State { Name = "Kerala" },
            new State { Name = "Karnataka" },
            new State { Name = "Maharashtra" },
            new State { Name = "Tamil Nadu" },
            new State { Name = "Delhi" }
        };
        context.States.AddRange(states);

        var ageCategories = new AgeCategory[]
        {
            new AgeCategory { Name = "Minor", MinAge = 0, MaxAge = 17 },
            new AgeCategory { Name = "Adult", MinAge = 18, MaxAge = 59 },
            new AgeCategory { Name = "Senior Citizen", MinAge = 60, MaxAge = 120 }
        };
        context.AgeCategories.AddRange(ageCategories);

        var processes = new Process[]
        {
            new Process { Name = "Driving License Application", Description = "Apply for a new Learner's or Driving License" },
            new Process { Name = "Passport Application", Description = "Apply for a new Fresh Passport" },
            new Process { Name = "Voter ID Registration", Description = "Enroll in the electoral roll" },
            new Process { Name = "Ration Card Application", Description = "Apply for a new family ration card" }
        };
        context.Processes.AddRange(processes);

        var documents = new Document[]
        {
            new Document { Name = "Adhaar Card", Notes = "Original and Copy" },
            new Document { Name = "Birth Certificate", Notes = "Issued by Municipality/Panchayat" },
            new Document { Name = "SSLC Certificate", Notes = "10th Standard Marksheet" },
            new Document { Name = "School ID Card", Notes = "Valid ID from recognized institution" },
            new Document { Name = "Passport Size Photo", Notes = "Recent color photograph with white background" },
            new Document { Name = "Bank Passbook", Notes = "Front page with account details" },
            new Document { Name = "Electricity Bill", Notes = "Recent bill (not older than 3 months)" },
            new Document { Name = "Rental Agreement", Notes = "Registered rental agreement" },
            new Document { Name = "Pan Card", Notes = "For identity proof" }
        };
        context.Documents.AddRange(documents);
        
        context.SaveChanges();

        // Now link them with Requirements
        // Helper to find IDs
        var kerala = states.Single(s => s.Name == "Kerala");
        var minor = ageCategories.Single(a => a.Name == "Minor");
        var adult = ageCategories.Single(a => a.Name == "Adult");
        
        var dl = processes.Single(p => p.Name == "Driving License Application");
        var passport = processes.Single(p => p.Name == "Passport Application");

        var adhaar = documents.Single(d => d.Name == "Adhaar Card");
        var birthCert = documents.Single(d => d.Name == "Birth Certificate");
        var schoolId = documents.Single(d => d.Name == "School ID Card");
        var sslc = documents.Single(d => d.Name == "SSLC Certificate");
        var photo = documents.Single(d => d.Name == "Passport Size Photo");

        var requirements = new Requirement[]
        {
            // Driving License - Minor - Kerala
            // Only valid for > 16 for non-geared, but let's assume standard logic
            new Requirement { ProcessId = dl.Id, AgeCategoryId = minor.Id, StateId = kerala.Id, DocumentId = birthCert.Id, SortOrder = 1, StepDescription = "Proof of Date of Birth" },
            new Requirement { ProcessId = dl.Id, AgeCategoryId = minor.Id, StateId = kerala.Id, DocumentId = adhaar.Id, SortOrder = 2, StepDescription = "Proof of Identity" },
            new Requirement { ProcessId = dl.Id, AgeCategoryId = minor.Id, StateId = kerala.Id, DocumentId = photo.Id, SortOrder = 3, StepDescription = "2 Recent Photographs" },
            
            // Driving License - Adult - All India (StateId check handled in controller? No, assume state specific override or base logic)
            // Let's add for specific state for now
            new Requirement { ProcessId = dl.Id, AgeCategoryId = adult.Id, StateId = kerala.Id, DocumentId = sslc.Id, SortOrder = 1, StepDescription = "Proof of Age & Qualification" },
            new Requirement { ProcessId = dl.Id, AgeCategoryId = adult.Id, StateId = kerala.Id, DocumentId = adhaar.Id, SortOrder = 2, StepDescription = "Proof of Address & Identity" },
            
            // Passport - Minor
            new Requirement { ProcessId = passport.Id, AgeCategoryId = minor.Id, DocumentId = birthCert.Id, SortOrder = 1, StepDescription = "Proof of Birth" },
            new Requirement { ProcessId = passport.Id, AgeCategoryId = minor.Id, DocumentId = adhaar.Id, SortOrder = 2, StepDescription = "Proof of Identity" },
             
             // Passport - Adult
            new Requirement { ProcessId = passport.Id, AgeCategoryId = adult.Id, DocumentId = sslc.Id, SortOrder = 1, StepDescription = "ECNR Proof (Education)" },
            new Requirement { ProcessId = passport.Id, AgeCategoryId = adult.Id, DocumentId = adhaar.Id, SortOrder = 2, StepDescription = "Address Proof" },
            new Requirement { ProcessId = passport.Id, AgeCategoryId = adult.Id, DocumentId = photo.Id, SortOrder = 3, StepDescription = "Photographs" },
        };

        context.Requirements.AddRange(requirements);
        context.SaveChanges();
    }
}
