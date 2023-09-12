"use client"
import { useForm } from "react-hook-form";
import * as z from "zod"
import { zodResolver } from "@hookform/resolvers/zod";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "../ui/form";
import { Button } from "../ui/button";
import { Textarea } from "../ui/textarea";
import { ThreadValidation } from "@/lib/validations/threads";
import { createThread } from "@/lib/actions/threads.actions";
import { usePathname, useRouter } from "next/navigation";
import { useOrganization } from "@clerk/nextjs";


function PostThread({ userId }: { userId: string }) {
  const pathname = usePathname()
  const router = useRouter()
  const { organization } = useOrganization()
  console.log(userId)
  const form = useForm<z.infer<typeof ThreadValidation>>({
    resolver: zodResolver(ThreadValidation),
    defaultValues: {
      thread: "",
      accountId: userId,
    },
  });
  const onSubmit = async (values: z.infer<typeof ThreadValidation>) => {
      await createThread({
        text: values.thread,
        author: userId,
        communityId: organization ? organization.id : null,
        path: pathname,
      });
   


    router.push("/");
  };

  return (
    <Form {...form}>
      <form
        className='mt-10 flex flex-col justify-start gap-10'
        onSubmit={form.handleSubmit(onSubmit)}
      >
        <FormField
          control={form.control}
          name='thread'
          render={({ field }) => (
            <FormItem className='flex w-full flex-col gap-3'>
              <FormLabel className='text-base-semibold text-light-2'>
                Content
              </FormLabel>
              <FormControl className='no-focus border border-dark-4 bg-dark-3 text-light-1'>
                <Textarea rows={15} {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <Button type='submit' className='bg-primary-500'>
          Post Thread
        </Button>
      </form>
    </Form>
  )
}

export default PostThread;
