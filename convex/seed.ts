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
        title: "Code Warriors Network Security Audit",
        description: "Audit and reinforce security protocols for Code Warriors infrastructure. Review firewall configurations and implement zero-trust architecture for the hackathon network.",
        type: "digital" as const,
        status: "active" as const,
      },
      {
        title: "Field Reconnaissance - Connaught Place",
        description: "Survey the central business district for potential security vulnerabilities. Document entry points and surveillance coverage in the heart of Delhi.",
        type: "physical" as const,
        status: "active" as const,
        location: {
          lat: 28.6315,
          lng: 77.2167,
          address: "Connaught Place, New Delhi, India",
        },
      },
      {
        title: "Encrypted Communication Protocol",
        description: "Develop and test new end-to-end encryption system for secure team communications. Implement key rotation mechanism.",
        type: "digital" as const,
        status: "active" as const,
      },
      {
        title: "Asset Recovery - DPS Vasant Kunj Campus",
        description: "Retrieve classified equipment from secure storage facility at DPS Vasant Kunj. Verify inventory and transport to secure location for Code Warriors hackathon setup.",
        type: "physical" as const,
        status: "active" as const,
        location: {
          lat: 28.5244,
          lng: 77.1588,
          address: "DPS Vasant Kunj, Sector C, Vasant Kunj, New Delhi, India",
        },
      },
      {
        title: "Network Penetration Testing",
        description: "Conduct authorized penetration test on client infrastructure. Document vulnerabilities and provide remediation recommendations.",
        type: "digital" as const,
        status: "active" as const,
      },
      {
        title: "Surveillance Equipment Deployment - India Gate",
        description: "Install monitoring equipment at designated coordinates near India Gate. Ensure proper concealment and test signal transmission for the operation.",
        type: "physical" as const,
        status: "completed" as const,
        location: {
          lat: 28.6129,
          lng: 77.2295,
          address: "India Gate, Rajpath, New Delhi, India",
        },
      },
      {
        title: "Database Migration",
        description: "Migrate legacy systems to new secure infrastructure. Ensure zero downtime and data integrity throughout process.",
        type: "digital" as const,
        status: "active" as const,
      },
      {
        title: "Dead Drop Verification - Qutub Minar",
        description: "Verify security of designated exchange location near Qutub Minar. Check for surveillance and establish backup protocols for Code Warriors intel exchange.",
        type: "physical" as const,
        status: "active" as const,
        location: {
          lat: 28.5244,
          lng: 77.1855,
          address: "Qutub Minar Complex, Mehrauli, New Delhi, India",
        },
      },
      {
        title: "Code Review - Authentication Module",
        description: "Security audit of authentication system. Identify potential vulnerabilities in session management and token handling.",
        type: "digital" as const,
        status: "completed" as const,
      },
      {
        title: "Safe House Inspection - Hauz Khas Village",
        description: "Conduct security assessment of backup facility in Hauz Khas. Verify emergency protocols and supply inventory for Code Warriors operations.",
        type: "physical" as const,
        status: "active" as const,
        location: {
          lat: 28.5494,
          lng: 77.1925,
          address: "Hauz Khas Village, New Delhi, India",
        },
      },
      {
        title: "Warrior Protocol Activation - DPS Command Center",
        description: "Activate the Warrior Protocol at DPS Vasant Kunj command center. Initialize all systems for Code Warriors hackathon and verify operational readiness.",
        type: "physical" as const,
        status: "active" as const,
        location: {
          lat: 28.5244,
          lng: 77.1588,
          address: "DPS Vasant Kunj, Sector C, Vasant Kunj, New Delhi, India",
        },
      },
    ];

    for (const assignment of assignments) {
      await ctx.db.insert("assignments", assignment);
    }

    return { message: `Seeded ${assignments.length} assignments` };
  },
});
