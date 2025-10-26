import { mutation } from "./_generated/server";

export const seedAssignments = mutation({
  args: {},
  handler: async (ctx) => {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) {
      throw new Error("Not authenticated");
    }

    const existingAssignments = await ctx.db.query("assignments").collect();
    if (existingAssignments.length > 0) {
      return { message: "Assignments already exist" };
    }

    const assignments = [
      {
        title: "Secure Server Infrastructure",
        description: "Audit and reinforce security protocols for primary data center. Review firewall configurations and implement zero-trust architecture.",
        type: "digital" as const,
        status: "active" as const,
      },
      {
        title: "Field Reconnaissance - Downtown",
        description: "Survey the financial district for potential security vulnerabilities. Document entry points and surveillance coverage.",
        type: "physical" as const,
        status: "active" as const,
        location: {
          lat: 37.7946,
          lng: -122.3999,
        },
      },
      {
        title: "Encrypted Communication Protocol",
        description: "Develop and test new end-to-end encryption system for secure team communications. Implement key rotation mechanism.",
        type: "digital" as const,
        status: "active" as const,
      },
      {
        title: "Asset Recovery - Warehouse 7",
        description: "Retrieve classified equipment from storage facility. Verify inventory and transport to secure location.",
        type: "physical" as const,
        status: "active" as const,
        location: {
          lat: 37.7699,
          lng: -122.3892,
        },
      },
      {
        title: "Network Penetration Testing",
        description: "Conduct authorized penetration test on client infrastructure. Document vulnerabilities and provide remediation recommendations.",
        type: "digital" as const,
        status: "active" as const,
      },
      {
        title: "Surveillance Equipment Deployment",
        description: "Install monitoring equipment at designated coordinates. Ensure proper concealment and test signal transmission.",
        type: "physical" as const,
        status: "completed" as const,
        location: {
          lat: 37.8044,
          lng: -122.2712,
        },
      },
      {
        title: "Database Migration",
        description: "Migrate legacy systems to new secure infrastructure. Ensure zero downtime and data integrity throughout process.",
        type: "digital" as const,
        status: "active" as const,
      },
      {
        title: "Dead Drop Verification - Golden Gate",
        description: "Verify security of designated exchange location. Check for surveillance and establish backup protocols.",
        type: "physical" as const,
        status: "active" as const,
        location: {
          lat: 37.8199,
          lng: -122.4783,
        },
      },
      {
        title: "Code Review - Authentication Module",
        description: "Security audit of authentication system. Identify potential vulnerabilities in session management and token handling.",
        type: "digital" as const,
        status: "completed" as const,
      },
      {
        title: "Safe House Inspection",
        description: "Conduct security assessment of backup facility. Verify emergency protocols and supply inventory.",
        type: "physical" as const,
        status: "active" as const,
        location: {
          lat: 37.7576,
          lng: -122.4376,
        },
      },
    ];

    for (const assignment of assignments) {
      await ctx.db.insert("assignments", assignment);
    }

    return { message: `Seeded ${assignments.length} assignments` };
  },
});
