"use client";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import {
  Project,
  Role,
  Stage,
  User,
  stages as mockStages,
  roles as mockRoles,
  users as mockUsers,
  projects as mockProjects,
} from "@devcycle/shared";
import { apiClient } from "./apiClient";

export function useFlows() {
  return useQuery({
    queryKey: ["flows"],
    queryFn: async () => {
      try {
        return (await apiClient.get<Stage[]>("/flows")).data;
      } catch {
        return mockStages;
      }
    },
    staleTime: Infinity,
  });
}

export function useRoles() {
  return useQuery({
    queryKey: ["roles"],
    queryFn: async () => {
      try {
        return (await apiClient.get<Role[]>("/roles")).data;
      } catch {
        return mockRoles;
      }
    },
    staleTime: Infinity,
  });
}

export function useUsers() {
  return useQuery({
    queryKey: ["users"],
    queryFn: async () => {
      try {
        return (await apiClient.get<User[]>("/users")).data;
      } catch {
        return mockUsers;
      }
    },
    staleTime: Infinity,
  });
}

export function useProjects() {
  return useQuery({
    queryKey: ["projects"],
    queryFn: async () => {
      try {
        return (await apiClient.get<Project[]>("/projects")).data;
      } catch {
        return mockProjects;
      }
    },
  });
}

export function useProject(id: string | undefined) {
  return useQuery({
    queryKey: ["projects", id],
    queryFn: async () => {
      try {
        return (await apiClient.get<Project>(`/projects/${id}`)).data;
      } catch {
        return mockProjects.find((p) => p.id === id) ?? mockProjects[0];
      }
    },
    enabled: Boolean(id),
  });
}

interface PatchProjectInput {
  id: string;
  status?: Project["status"];
  priority?: Project["priority"];
  stageData?: Record<string, Record<string, unknown>>;
}

export function usePatchProject() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async ({ id, ...body }: PatchProjectInput) =>
      (await apiClient.patch<Project>(`/projects/${id}`, body)).data,
    onSuccess: (project) => {
      queryClient.setQueryData(["projects", project.id], project);
      queryClient.invalidateQueries({ queryKey: ["projects"] });
    },
  });
}

interface AddApprovalInput {
  projectId: string;
  subStepId: string;
  roleId: string;
  userId: string;
  decision: "aprobado" | "rechazado";
  comment?: string;
}

export function useAddApproval() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async ({ projectId, ...body }: AddApprovalInput) =>
      (await apiClient.post<Project>(`/projects/${projectId}/approvals`, body)).data,
    onSuccess: (project) => {
      queryClient.setQueryData(["projects", project.id], project);
      queryClient.invalidateQueries({ queryKey: ["projects"] });
    },
  });
}

interface AddFileInput {
  projectId: string;
  name: string;
  size: number;
  type: string;
}

export function useAddFile() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async ({ projectId, ...body }: AddFileInput) =>
      (await apiClient.post<Project>(`/projects/${projectId}/files`, body)).data,
    onSuccess: (project) => {
      queryClient.setQueryData(["projects", project.id], project);
    },
  });
}

interface ChatInput {
  message: string;
  context?: { stageId?: string; subStepId?: string };
}

interface ChatOutput {
  id: string;
  text: string;
  ts: string;
  suggestions?: string[];
}

export function useSendChatMessage() {
  return useMutation({
    mutationFn: async (input: ChatInput) =>
      (await apiClient.post<ChatOutput>("/assistant/chat", input)).data,
  });
}
