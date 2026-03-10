import { useState, useEffect } from "react";
import { Plus, Pencil, Trash2, ArrowLeft, Layers } from "lucide-react";
import api from "@/services/api";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { toast } from "@/components/ui/use-toast";

const CareerTracksManagement = () => {

  const [tracks, setTracks] = useState([]);
  const [resources, setResources] = useState([]);
  const [selectedTrack, setSelectedTrack] = useState(null);

  const [trackForm, setTrackForm] = useState({ name: "", description: "" });
  const [editingTrack, setEditingTrack] = useState(null);

  const [resourceForm, setResourceForm] = useState({
    title: "",
    description: "",
    youtubeLink: "",
    orderIndex: 1
  });

  const [editingResource, setEditingResource] = useState(null);

  /* ================= LOAD TRACKS ================= */

  const loadTracks = async () => {
    try {
      const res = await api.get("/api/career-tracks");
      setTracks(res.data);
    } catch {
      toast({ title: "Failed to load tracks" });
    }
  };

  /* ================= LOAD RESOURCES ================= */

  const loadResources = async (trackId) => {
    try {
      const res = await api.get(`/api/career-tracks/${trackId}`);
      setResources(res.data.sort((a, b) => a.orderIndex - b.orderIndex));
    } catch {
      toast({ title: "Failed to load resources" });
    }
  };

  useEffect(() => {
    loadTracks();
  }, []);

  /* ================= TRACK CRUD ================= */

  const createTrack = async () => {
    try {
      await api.post("/api/admin/career-tracks", trackForm);
      setTrackForm({ name: "", description: "" });
      loadTracks();
    } catch {
      toast({ title: "Failed to create track" });
    }
  };

  const updateTrack = async () => {
    try {
      await api.put(`/api/admin/career-tracks/tracks/${editingTrack}`, trackForm);
      setEditingTrack(null);
      setTrackForm({ name: "", description: "" });
      loadTracks();
    } catch {
      toast({ title: "Failed to update track" });
    }
  };

  const deleteTrack = async (id) => {
    if (!confirm("Delete this track?")) return;

    await api.delete(`/api/admin/career-tracks/tracks/${id}`);
    loadTracks();
  };

  /* ================= RESOURCE CRUD ================= */

  const createResource = async () => {
    try {
      await api.post(`/api/admin/career-tracks/${selectedTrack.id}/resources`, resourceForm);
      setResourceForm({ title: "", description: "", youtubeLink: "", orderIndex: 1 });
      loadResources(selectedTrack.id);
    } catch {
      toast({ title: "Failed to add resource" });
    }
  };

  const updateResource = async () => {
    try {
      await api.put(`/api/admin/career-tracks/resources/${editingResource}`, resourceForm);
      setEditingResource(null);
      setResourceForm({ title: "", description: "", youtubeLink: "", orderIndex: 1 });
      loadResources(selectedTrack.id);
    } catch {
      toast({ title: "Failed to update resource" });
    }
  };

  const deleteResource = async (id) => {
    await api.delete(`/api/admin/career-tracks/resources/${id}`);
    loadResources(selectedTrack.id);
  };

  return (
    <div className="space-y-6">

      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold">Career Tracks</h1>

        {selectedTrack && (
          <Button variant="ghost" onClick={() => setSelectedTrack(null)}>
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back
          </Button>
        )}
      </div>

      {!selectedTrack && (
        <>
          {/* CREATE / EDIT TRACK FORM */}

          <Card>
            <CardHeader>
              <CardTitle>{editingTrack ? "Edit Track" : "Create Track"}</CardTitle>
            </CardHeader>

            <CardContent className="space-y-3">

              <Input
                placeholder="Track name"
                value={trackForm.name}
                onChange={(e) =>
                  setTrackForm({ ...trackForm, name: e.target.value })
                }
              />

              <Input
                placeholder="Description"
                value={trackForm.description}
                onChange={(e) =>
                  setTrackForm({ ...trackForm, description: e.target.value })
                }
              />

              <Button onClick={editingTrack ? updateTrack : createTrack}>
                {editingTrack ? "Update Track" : "Create Track"}
              </Button>

            </CardContent>
          </Card>

          {/* TRACK LIST */}

          <div className="grid md:grid-cols-2 gap-4">

            {tracks.map((track) => (

              <Card key={track.id}>

                <CardHeader className="flex justify-between flex-row">

                  <CardTitle>{track.name}</CardTitle>

                  <div className="flex gap-2">

                    <Button
                      size="sm"
                      variant="ghost"
                      onClick={() => {
                        setSelectedTrack(track);
                        loadResources(track.id);
                      }}
                    >
                      <Layers className="w-4 h-4" />
                    </Button>

                    <Button
                      size="sm"
                      variant="ghost"
                      onClick={() => {
                        setEditingTrack(track.id);
                        setTrackForm({
                          name: track.name,
                          description: track.description,
                        });
                      }}
                    >
                      <Pencil className="w-4 h-4" />
                    </Button>

                    <Button
                      size="sm"
                      variant="ghost"
                      onClick={() => deleteTrack(track.id)}
                    >
                      <Trash2 className="w-4 h-4 text-red-500" />
                    </Button>

                  </div>

                </CardHeader>

                <CardContent>
                  <p className="text-sm">{track.description}</p>
                </CardContent>

              </Card>

            ))}

          </div>
        </>
      )}

      {/* RESOURCE MANAGEMENT */}

      {selectedTrack && (
        <>

          <Card>

            <CardHeader>
              <CardTitle>Add Resource</CardTitle>
            </CardHeader>

            <CardContent className="space-y-3">

              <Input
                placeholder="Title"
                value={resourceForm.title}
                onChange={(e) =>
                  setResourceForm({ ...resourceForm, title: e.target.value })
                }
              />

              <Input
                placeholder="Description"
                value={resourceForm.description}
                onChange={(e) =>
                  setResourceForm({
                    ...resourceForm,
                    description: e.target.value,
                  })
                }
              />

              <Input
                placeholder="Resource Link"
                value={resourceForm.youtubeLink}
                onChange={(e) =>
                  setResourceForm({ ...resourceForm, youtubeLink: e.target.value })
                }
              />

              <Input
                type="number"
                placeholder="Order"
                value={resourceForm.orderIndex}
                onChange={(e) =>
                  setResourceForm({
                    ...resourceForm,
                    orderIndex: Number(e.target.value),
                  })
                }
              />

              <Button onClick={editingResource ? updateResource : createResource}>
                {editingResource ? "Update Resource" : "Add Resource"}
              </Button>

            </CardContent>

          </Card>

          {/* RESOURCE LIST */}

          {resources.map((res) => (

            <Card key={res.id}>

              <CardContent className="flex justify-between p-4">

                <div>
  <h3 className="font-bold">{res.title}</h3>
  <p className="text-sm">{res.description}</p>

  {res.youtubeLink && (
    <a
      href={res.youtubeLink}
      target="_blank"
      rel="noopener noreferrer"
      className="text-blue-500 text-sm underline"
    >
      Open Resource
    </a>
  )}
</div>

                <div className="flex gap-2">

                  <Button
                    size="sm"
                    variant="ghost"
                    onClick={() => {
                      setEditingResource(res.id);
                      setResourceForm(res);
                    }}
                  >
                    <Pencil className="w-4 h-4" />
                  </Button>

                  <Button
                    size="sm"
                    variant="ghost"
                    onClick={() => deleteResource(res.id)}
                  >
                    <Trash2 className="w-4 h-4 text-red-500" />
                  </Button>

                </div>

              </CardContent>

            </Card>

          ))}

        </>
      )}

    </div>
  );
};

export default CareerTracksManagement;