
'use server'
import { userService } from "@/services/user.services";
import { TUpdateUserInput } from "@/types/user.types";


export async function updateUserProfileAction(
  updateData: Partial<TUpdateUserInput>,
) {
  const result = await userService.updateUser(updateData);
  return result;
}

export async function deleteuserown() {
    const result = await userService.deleteUserOwn();
    return result;
}

export async function getAllUsersAction(params?: any, options?: { cache?: RequestCache; revalidate?: number }) {
    const result = await userService.getAllUsers(params, options);
    return result;
}
export async function updateUserByAdminAction(id: string, data: Partial<{ [key: string]: any }>) {
    const result = await userService.updateUserByADmin(id, data);
    return result;
}

export async function deleteUserByAdminAction(id: string) {
    const result = await userService.deleteUserByAdmin(id);
    return result;
}

export async function getUserByIdAction(id: string) {
    const result = await userService.getuserbyid(id);
    return result;
}