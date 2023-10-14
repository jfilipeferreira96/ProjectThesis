"use client";
import { getSingleChallenge } from "@/services/challenge.service";
import React, { useEffect, useState } from "react";
import { routes } from "@/config/routes";
import { Card, Image, Text, Badge, Modal, Button, Group, Center, SimpleGrid, Grid, Title, TextInput, Flex, Loader, Container } from "@mantine/core";
import { useFieldArray, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";

const schema = z.object({
  name: z.string().min(1, { message: "Wrong name" }),
  lastname: z.string().min(1, { message: "Wrong last name" }),
  age: z.string().min(10),
  items: z.array(
    z.object({
      title: z.string().min(3),
    })
  ),
});

type UserForm = z.infer<typeof schema>;

const getInvalidProps = (hasError: boolean) =>
  hasError
    ? {
        "aria-invalid": true,
      }
    : {};

const Add = ({ params: { id } }: { params: { id: string } }) => {
  const {
    register,
    handleSubmit,
    control,
    formState: { errors },
  } = useForm<UserForm>({
    resolver: zodResolver(schema),
    mode: "onTouched",
  });

  const { fields, append, remove } = useFieldArray<UserForm>({
    control,
    name: "items", 
  });

  return (
    <main className="container">
      <article>
        <h1>Zod and react-hook-form</h1>
        <form
          onSubmit={handleSubmit((data) => {
            console.log(data);
          })}
        >
          <input type="text" placeholder="Enter name" {...register("name")} {...getInvalidProps(!!errors.name)} />
          {errors.name && <small>{errors.name.message}</small>}
          <input type="text" placeholder="Enter last name" {...register("lastname")} {...getInvalidProps(!!errors.lastname)} />
          {errors.lastname && <small>{errors.lastname.message}</small>}

          <input type="text" placeholder="Enter age" {...register("age")} {...getInvalidProps(!!errors.age)} />
          {errors.age && <small>{errors.age.message}</small>}
          <fieldset style={{ padding: 30, border: "1px solid gray", borderRadius: 5 }}>
            <ul style={{ padding: 0 }}>
              {fields.map((field, index) => (
                <li key={field.id}>
                  <div style={{ display: "flex", gap: 20, alignItems: "center" }}>
                    <input type="text" placeholder="Enter item title" id={field.id} {...register(`items.${index}.title`)} {...getInvalidProps(!!errors.items?.[index])} style={{ marginBottom: 0 }} />
                    <button style={{ width: "fit-content", margin: 0 }} onClick={() => remove(index)}>
                      &times;
                    </button>
                  </div>
                  {errors.items?.[index] && <small>{errors.items[index]?.title?.message}</small>}
                </li>
              ))}
            </ul>
            <button type="button" onClick={() => append({ title: "" })}>
              Add Item
            </button>
          </fieldset>
          <button>Submit</button>
        </form>
      </article>
    </main>
  );
};

export default Add;
