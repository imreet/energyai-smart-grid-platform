import type { DatasetMetadata, ModelSettings } from "@/backend.d";
import { useActor } from "@/hooks/useActor";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

export function useModelSettings() {
  const { actor, isFetching } = useActor();
  return useQuery({
    queryKey: ["modelSettings"],
    queryFn: async () => {
      if (!actor) return null;
      return actor.getModelSettings();
    },
    enabled: !!actor && !isFetching,
  });
}

export function useUpdateModelSettings() {
  const { actor } = useActor();
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (settings: ModelSettings) => {
      if (!actor) throw new Error("Not connected");
      return actor.updateModelSettings(settings);
    },
    onSuccess: () => qc.invalidateQueries({ queryKey: ["modelSettings"] }),
  });
}

export function useDatasetMetadata() {
  const { actor, isFetching } = useActor();
  return useQuery({
    queryKey: ["datasetMetadata"],
    queryFn: async () => {
      if (!actor) return null;
      return actor.getDatasetMetadata();
    },
    enabled: !!actor && !isFetching,
  });
}

export function useSetDatasetMetadata() {
  const { actor } = useActor();
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (metadata: DatasetMetadata) => {
      if (!actor) throw new Error("Not connected");
      return actor.setDatasetMetadata(metadata);
    },
    onSuccess: () => qc.invalidateQueries({ queryKey: ["datasetMetadata"] }),
  });
}

export function useAllAlerts() {
  const { actor, isFetching } = useActor();
  return useQuery({
    queryKey: ["alerts"],
    queryFn: async () => {
      if (!actor) return [];
      return actor.getAllAlerts();
    },
    enabled: !!actor && !isFetching,
  });
}

export function useAddAlert() {
  const { actor } = useActor();
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({
      severity,
      message,
    }: { severity: string; message: string }) => {
      if (!actor) throw new Error("Not connected");
      return actor.addAlert(severity, message);
    },
    onSuccess: () => qc.invalidateQueries({ queryKey: ["alerts"] }),
  });
}

export function useAcknowledgeAlert() {
  const { actor } = useActor();
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (id: bigint) => {
      if (!actor) throw new Error("Not connected");
      return actor.acknowledgeAlert(id);
    },
    onSuccess: () => qc.invalidateQueries({ queryKey: ["alerts"] }),
  });
}
