import Workspace from "../models/workspace_model.js";

const registerWorkspace = async (req, res) => {
    try {
        const { workspacename, picture, teammembers } = req.body
        const user = new Workspace({
            workspacename,
            picture,
            teammembers,
            userId: req.user._id
        })
        await user.save()
        res.status(200).json({
            message: "Workspace Created successfully"
        })
    } catch (err) {
        console.log(err)
        res.status(400).json({
            message: "Error in creating a workspace"
        })
    }
}

const printworkspaces = async (req, res) => {
    try {
        const workspaces = await Workspace.find({
            $or: [
                { userId: req.user._id },
                { teammembers: req.user._id }
            ]
        }).populate('teammembers').populate('userId');


        res.status(200).json({
            message: "Succesfully printed",
            data: workspaces
        })
    } catch (error) {
        console.log(error)
        res.status(400).json({
            message: "Error in settup workspaces"
        })
    }
}

const getWorkspaceDetails = async (req, res) => {
    try {
        const { id } = req.params
        const data = await Workspace.findById(id).populate('teammembers').populate('userId')
        res.status(200).json({
            message: "Succesfully printed",
            data
        })

    } catch (error) {
        console.log(error)
        res.status(400).json({
            message: "Error in settup workspaces"
        })
    }
}
const joinUserintoWorkspace = async (req, res) => {
    try {
        const { id } = req.params
        const userId = req.user._id
        const data = await Workspace.findById(id)

        if (!data) {
            return res.status(400).json({
                message: "No workspace found"
            })
        }
        if (data.teammembers.includes(userId)) {
            return res.status(400).json({
                message: "Member already exists"
            })
        }
        data.teammembers.push(userId)
        await data.save()
        res.status(200).json({
            message: "Added into the workspace Successfully"
        })
    } catch (error) {
        res.status(500).json({
            error,
            message: "Failed to adding to the workspace"
        })

    }
}
const updateWorkspace = async (req, res) => {
    try {
        const { id } = req.params;
        const { workspacename, picture } = req.body;

        const workspace = await Workspace.findById(id);

        if (!workspace) {
            return res.status(404).json({ message: "Workspace not found" });
        }

        if (!workspace.userId.equals(req.user._id)) {
            return res.status(403).json({ message: "Unauthorized to update this workspace" });
        }

        const updates = {};
        if (workspacename) updates.workspacename = workspacename;
        if (picture) updates.picture = picture;

        const updatedWorkspace = await Workspace.findByIdAndUpdate(
            id,
            { $set: updates },
            { new: true }
        );

        res.status(200).json({ 
            message: "Workspace updated successfully", 
            data: updatedWorkspace 
        });
    } catch (error) {
        console.error(error);
        res.status(400).json({ message: "Failed to update workspace", error });
    }
};

const deleteWorkspace = async (req, res) => {
    try {
        const { id } = req.params;

        const workspace = await Workspace.findById(id);

        if (!workspace) {
            return res.status(404).json({ message: "Workspace not found" });
        }

        // Optional: only owner can delete
        if (!workspace.userId.equals(req.user._id)) {
            return res.status(403).json({ message: "Unauthorized to delete this workspace" });
        }

        await Workspace.findByIdAndDelete(id);

        res.status(200).json({ message: "Workspace deleted successfully" });
    } catch (error) {
        console.log(error);
        res.status(400).json({ message: "Failed to delete workspace", error });
    }
};

export {
    registerWorkspace,
    printworkspaces,
    getWorkspaceDetails,
    joinUserintoWorkspace,
    updateWorkspace,
    deleteWorkspace
};
