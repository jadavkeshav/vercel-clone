const Domain = require('../models/domain.model');
const Project = require('../models/project.model');

exports.addCustomDomain = async (req, res) => {
  try {
    const { subdomain, isCustom } = req.body;
    const projectId = req.params.id;

    const project = await Project.findOne({ _id: projectId, owner: req.user._id });
    if (!project) return res.status(404).json({ success: false, message: "Project not found" });

    const existing = await Domain.findOne({ subdomain });
    if (existing) return res.status(400).json({ success: false, message: "Domain already in use" });

    const domain = await Domain.create({ subdomain, isCustom, project: project._id });
    project.domain = domain._id;
    await project.save();

    res.status(201).json({ success: true, domain });
  } catch (error) {
    console.error("Error adding domain:", error);
    res.status(500).json({ success: false, message: "Internal server error" });
  }
};

exports.getDomainByProjectId = async (req, res) => {
  try {
    const project = await Project.findOne({ _id: req.params.id, owner: req.user._id }).populate("domain");
    if (!project || !project.domain) {
      return res.status(404).json({ success: false, message: "Domain not found for project" });
    }
    res.status(200).json({ success: true, domain: project.domain });
  } catch (error) {
    res.status(500).json({ success: false, message: "Error fetching domain" });
  }
};

exports.deleteDomain = async (req, res) => {
  try {
    const project = await Project.findOne({ _id: req.params.id, owner: req.user._id }).populate("domain");
    if (!project || !project.domain) return res.status(404).json({ success: false, message: "No domain found" });

    await Domain.findByIdAndDelete(project.domain._id);
    project.domain = undefined;
    await project.save();

    res.status(200).json({ success: true, message: "Domain deleted successfully" });
  } catch (error) {
    res.status(500).json({ success: false, message: "Error deleting domain" });
  }
};
