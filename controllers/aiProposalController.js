import { generateProposalFromAI } from "../services/aiProposalService.js";

export const generateProposal = async (req, res) => {
  try {

    const {
      companyName,
      clientName,
      service,
      budget,
      timeline
    } = req.body;

    if (!companyName || !clientName || !service) {
      return res.status(400).json({
        success: false,
        message: "companyName, clientName and service are required"
      });
    }

    const proposal = await generateProposalFromAI({
      companyName,
      clientName,
      service,
      budget,
      timeline
    });
    console.log("AI Proposal Result:", proposal);
    res.json({
      success: true,
      message: "AI proposal generated successfully",
      data: proposal
    });

  } catch (error) {

    console.error("AI Proposal Error:", error);

    res.status(500).json({
      success: false,
      message: "Failed to generate proposal"
    });

  }
};